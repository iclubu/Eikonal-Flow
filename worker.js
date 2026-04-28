class VEXEngine {
  processTonalValue(r, g, b, gamma, contrast) {
    let v = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    if (gamma !== 1) v = Math.pow(v, gamma);
    if (contrast !== 1) v = (v - 0.5) * contrast + 0.5;
    return Math.max(0.01, Math.min(1, v));
  }

  generateWaveContours(imageData, seed, count, gamma, contrast) {
    const originalW = imageData.width;
    const originalH = imageData.height;
    const ds = Math.max(1, Math.floor(originalW / 400)); 
    const w = Math.floor(originalW / ds);
    const h = Math.floor(originalH / ds);
    const data = imageData.data;

    const T = new Float32Array(w * h).fill(1e10);
    const speed = new Float32Array(w * h);
    const frozen = new Uint8Array(w * h);

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const idx = (y * ds * originalW + (x * ds)) * 4;
        speed[y * w + x] = this.processTonalValue(data[idx], data[idx+1], data[idx+2], gamma, contrast);
      }
    }

    const startX = Math.floor(seed.x * w);
    const startY = Math.floor(seed.y * h);
    const startIdx = Math.max(0, Math.min(w * h - 1, startY * w + startX));
    T[startIdx] = 0;
    
    const heap = new MinHeap();
    heap.push({t: 0, idx: startIdx});

    while (!heap.isEmpty()) {
      const {t, idx} = heap.pop();
      if (frozen[idx]) continue;
      frozen[idx] = 1;

      const x = idx % w, y = Math.floor(idx / w);
      const neighbors = [[0,1],[0,-1],[1,0],[-1,0]];
      for (let i = 0; i < 4; i++) {
        const nx = x + neighbors[i][0], ny = y + neighbors[i][1];
        if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
          const nIdx = ny * w + nx;
          if (!frozen[nIdx]) {
            const val = this.solveEikonal(T, nx, ny, w, h, speed[nIdx]);
            if (val < T[nIdx]) {
              T[nIdx] = val;
              heap.push({t: val, idx: nIdx});
            }
          }
        }
      }
    }
    return this.marchingSquaresFromMap(T, w, h, count, ds);
  }

  solveEikonal(T, x, y, w, h, f) {
    const ta = Math.min(x > 0 ? T[y*w + (x-1)] : 1e10, x < w - 1 ? T[y*w + (x+1)] : 1e10);
    const tb = Math.min(y > 0 ? T[(y-1)*w + x] : 1e10, y < h - 1 ? T[(y+1)*w + x] : 1e10);
    const s = 1.0 / f;
    if (Math.abs(ta - tb) < s) {
      return (ta + tb + Math.sqrt(2 * s * s - (ta - tb) * (ta - tb))) / 2;
    }
    return Math.min(ta, tb) + s;
  }

  marchingSquaresFromMap(map, w, h, count, ds) {
    const segments = [];
    let maxT = 0;
    for(let i=0; i<map.length; i++) if(map[i] < 1e9 && map[i] > maxT) maxT = map[i];

    for (let i = 0; i < count; i++) {
      const threshold = maxT * ((i + 1) / (count + 1));
      for (let y = 0; y < h - 1; y++) {
        for (let x = 0; x < w - 1; x++) {
          const v1 = map[y*w+x], v2 = map[y*w+x+1], v3 = map[(y+1)*w+x+1], v4 = map[(y+1)*w+x];
          let config = 0;
          if (v1 > threshold) config |= 8;
          if (v2 > threshold) config |= 4;
          if (v3 > threshold) config |= 2;
          if (v4 > threshold) config |= 1;
          if (config === 0 || config === 15) continue;
          const p1=[x*ds,y*ds], p2=[(x+1)*ds,y*ds], p3=[(x+1)*ds,(y+1)*ds], p4=[x*ds,(y+1)*ds];
          this.getSegments(config, p1, p2, p3, p4).forEach(s => segments.push(s));
        }
      }
    }
    return this.chainSegments(segments);
  }

  getSegments(config, p1, p2, p3, p4) {
    const midX = (p1[0] + p2[0]) / 2, midY = (p1[1] + p4[1]) / 2;
    const l=[p1[0], midY], r=[p2[0], midY], t=[midX, p1[1]], b=[midX, p4[1]];
    switch (config) {
      case 1: case 14: return [[l, b]]; case 2: case 13: return [[b, r]];
      case 3: case 12: return [[l, r]]; case 4: case 11: return [[t, r]];
      case 5: return [[l, t], [b, r]]; case 6: case 9: return [[t, b]];
      case 7: case 8: return [[l, t]]; case 10: return [[l, b], [t, r]];
      default: return [];
    }
  }

  chainSegments(segments) {
    const paths = [];
    const used = new Uint8Array(segments.length);
    const pointToKey = (p) => `${Math.round(p[0])},${Math.round(p[1])}`;
    for (let i = 0; i < segments.length; i++) {
      if (used[i]) continue;
      let path = [segments[i][0], segments[i][1]];
      used[i] = 1;
      let found = true;
      while (found) {
        found = false;
        let lastK = pointToKey(path[path.length - 1]);
        for (let j = 0; j < segments.length; j++) {
          if (!used[j]) {
            if (pointToKey(segments[j][0]) === lastK) { path.push(segments[j][1]); used[j] = 1; found = true; break; }
            else if (pointToKey(segments[j][1]) === lastK) { path.push(segments[j][0]); used[j] = 1; found = true; break; }
          }
        }
      }
      paths.push(`M ${path[0][0]} ${path[0][1]} ` + path.slice(1).map(p => `L ${p[0]} ${p[1]}`).join(' '));
    }
    return paths;
  }
}

class MinHeap {
  constructor() { this.data = []; }
  push(val) {
    this.data.push(val);
    let i = this.data.length - 1;
    while (i > 0) {
      let p = (i - 1) >> 1;
      if (this.data[i].t < this.data[p].t) {
        [this.data[i], this.data[p]] = [this.data[p], this.data[i]];
        i = p;
      } else break;
    }
  }
  pop() {
    if (this.data.length === 1) return this.data.pop();
    const top = this.data[0];
    this.data[0] = this.data.pop();
    let i = 0;
    while (true) {
      let l = (i << 1) + 1, r = (i << 1) + 2, min = i;
      if (l < this.data.length && this.data[l].t < this.data[min].t) min = l;
      if (r < this.data.length && this.data[r].t < this.data[min].t) min = r;
      if (min !== i) {
        [this.data[i], this.data[min]] = [this.data[min], this.data[i]];
        i = min;
      } else break;
    }
    return top;
  }
  isEmpty() { return this.data.length === 0; }
}

const engine = new VEXEngine();
self.onmessage = function(e) {
  const { imageData, gamma, contrast, count, seed } = e.data;
  const results = engine.generateWaveContours(imageData, seed, count, gamma, contrast);
  self.postMessage({ paths: results });
};