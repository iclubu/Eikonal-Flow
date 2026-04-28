# EIKONAL-FLOW | VEX Engine Technical Specifications

## 🌊 The Wave Propagation Module (FMM)
Unlike standard contouring, this engine treats images as **Speed Maps** using the **Fast Marching Method (FMM)**.

### 1. Eikonal Equation Solver
* **Dynamic Physics Simulation**: The engine solves the Eikonal equation to calculate the time-of-arrival for a wavefront propagating from a seed point.
* **Tonal Friction**: Shadows act as high-resistance zones, while highlights allow the wavefront to travel at maximum velocity. This creates the "warping" effect seen in professional plotter art.

### 2. High-Performance Optimization
* **Binary Min-Heap**: To achieve real-time responsiveness, a custom Min-Heap manages the wavefront priority queue, reducing complexity to $O(N \log N)$.
* **Grid Downsampling**: Heavy math is calculated on a optimized 400px grid and upscaled for display, allowing for instant feedback on hardware like the MacBook Pro.

## 🛠️ STUDIO Features
* **Path Chaining**: Fragmented vector segments are automatically joined into continuous polylines, reducing plotter pen-lifts by up to 90%.
* **Interactive Seed Origin**: Users can dynamically reposition the wave origin to change the perspective and flow of the vector field.
* **Local Processing**: 100% private, browser-side computation via Web Workers.