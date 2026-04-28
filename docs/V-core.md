# Eikonal-Flow

## VEX Engine (Vector Expression Engine) 

🎯 **What this is**
ikonal-Flow generator with full control over tonal shaping, contour distribution, line behavior, and output refinement.

---

## ⚙️ The STUDIO Advantage

### 🔹 Tonal Shaping (Studio Module)
*   **Gamma Control**: Shifts the tonal weighting. High gamma clusters lines in highlights; low gamma reveals intricate shadow detail.
*   **Contrast Control**: Expands the distance between tonal values to isolate usable contour regions.
*   **Invert Mode**: Swaps light and dark elevations for light-on-dark plotting styles.

### 🔹 Contour Distribution & Geometry
*   **Adjustable Count**: Define up to 100 contour levels for extreme density and realism.
*   **Interpolated Smoothing**: A high-precision logic that calculates the exact crossing points of thresholds, resulting in fluid, organic paths instead of rigid steps.
*   **Path Simplification**: Integration of the Ramer-Douglas-Peucker algorithm to reduce point density while maintaining shape fidelity.
*   **Centerline Extraction (Skeletonization)**: Implemented Zhang-Suen thinning algorithm to reduce thick lines to single, continuous centerlines, ideal for vectorizing sketches and drawings.

### 🔹 Output Refinement (Plotter Optimized)
*   **Path Chaining**: The engine automatically chains fragmented segments into continuous polylines. This reduces pen-lifts by up to 90%, preventing mechanical chatter and drastically speeding up plot times.
*   **Clean SVG Export**: Paths are exported with `fill="none"` and precise stroke widths, compatible with **Inkscape**, **Adobe Illustrator**, **Cricut**, and **Silhouette**.
*   **Stats HUD**: Real-time feedback on Path and Point counts to ensure hardware compatibility before export.

---

## 🛠️ Feature Set Recap
*   **Drag & Drop**: Direct image input into the browser.
*   **Local Processing**: 100% private, browser-side computation via the VEX Engine.
*   **Clipboard Export**: Instant XML copy for vector software workflows.
*   **Real-Time Preview**: Low-latency canvas feedback.

---

## 🚀 Technical Specifications
*   **Architecture**: React.js SPA.
*   **Algorithm**: Enhanced Marching Squares with Linear Interpolation and Segment Chaining.
*   **Output**: High-precision SVG (XML).

---

## 🐞 Current Known Issues
*   **None**: All known issues have been resolved. The `index.html` Babel Transpilation Error has been fixed.

## 🔮 Future Enhancements (Roadmap)
1.  **Bézier Smoothing**: Transition from rigid polylines to smooth C-curves for more fluid mechanical movement.
2.  **T-Max (Percentile Cap)**: Limit contour generation in extremely high or low-density areas to prevent "far-field noise" or excessive ink bleed.
3.  **Custom Stroke Colors**: Allow users to preview how different pen colors will look on the final plot.


## 🎯 Overview
**CONTOUR-V STUDIO** is a professional-grade, browser-based vector field generator powered by the **VEX Engine (Vector Expression Engine)**. This version introduces **Centerline Extraction (Skeletonization)** alongside its advanced contouring system, providing users with the ability to generate single-stroke vector paths for complex raster inputs.

---

## ⚙️ The VEX Engine: Processing Modes
The engine now supports two distinct computational modes for transforming imagery into plot-ready SVG data.

### 1. Advanced Contour Mode (Marching Squares)
* **Topographic Mapping**: Treats image brightness as elevation to create "isoline" paths. [cite: 5.16.1]
* **Interpolated Smoothing**: Calculates exact threshold crossing points for fluid, organic curves rather than rigid steps. [cite: 5.16.2]
* **Tonal Control**: Integrated Gamma and Contrast sliders allow for precise isolation of usable contour regions before generation. [cite: 5.16.2]

### 2. Centerline Extraction Mode (Skeletonization)
* **Zhang-Suen Thinning**: An iterative algorithm that erodes binary masks until only a 1-pixel-wide "skeleton" or medial axis remains. [cite: 5.14.1]
* **Single-Stroke Optimization**: Unlike contours that trace outlines, this mode finds the center of a shape, making it ideal for vectorizing sketches, signatures, and technical drawings. [cite: 5.14.1]
* **Simplification (Epsilon)**: Uses the **Ramer-Douglas-Peucker algorithm** to reduce point density while maintaining the structural integrity of the skeleton. [cite: 5.14.3]

---

## 🛠️ STUDIO Feature Set & UX

### 🔹 Input & Tonal Shaping
* **Invert Mode**: Swaps light and dark elevations, essential for light-on-dark plotting styles or specialized portraiture. [cite: 5.16.2]
* **Real-Time Preview**: A low-latency canvas provides instant visual feedback for all slider adjustments. [cite: 5.16.2]
* **Drag & Drop**: Seamless image import directly into the browser workspace. [cite: 5.16.2]

### 🔹 Output Refinement (Plotter Optimized)
* **Path Chaining**: Automatically joins fragmented segments into continuous polylines. This reduces pen-lifts by up to 90%, preventing mechanical chatter and speeding up plot times. [cite: 5.16.2]
* **Clean SVG Export**: Standardized output with `fill="none"` and specific `stroke-width` to ensure compatibility with **Silhouette Studio**, **Cricut Design Space**, and **Adobe Illustrator**. [cite: 5.16.2]
* **Stats HUD**: Real-time monitoring of **Path** and **Point** counts to ensure files remain within hardware processing limits. [cite: 5.16.2]

---

## 💾 Technical Specifications
* **Architecture**: React.js SPA (Single Page Application). [cite: 5.16.2]
* **Privacy**: 100% local, browser-side processing; no image data is sent to external servers. [cite: 5.16.2]
* **Compatibility**: Designed for high-precision hardware including the **Silhouette Cameo 5** and other pen plotters. [cite: 5.16.2]
