# Phantom Bottle 🍊

A lightweight, highly performant React application demonstrating a **2.5D Relighting** effect using `@react-three/fiber`.

This project creates the illusion of a fully rendered 3D Fanta bottle without the overhead of loading complex `.gltf` or `.obj` models. By intelligently layering 2D maps on a simple flat plane, we achieve a dynamic, interactive "fake 3D" result.

## The Texture Pipeline Tester 🎛️

This project includes an interactive Texture Pipeline Tester. It demonstrates how different PBR (Physically Based Rendering) maps contribute to the final 2.5D illusion. You can switch between these modes directly in the UI:

1. **Flat Diffuse (1 Map):** The raw 2D image. No 3D lighting, no depth.
2. **2.5D Magic (2 Maps):** The core trick! Applies the Diffuse map and the **Normal Map**, which bends the interactive light to simulate the bottle's shape. It also activates a digital `clearcoat` to fake a highly reflective glass/plastic layer on top.
3. **Pro Material (3 Maps):** Adds the **Roughness Map**. This map tells the light which parts of the bottle are glossy (the plastic) and which are matte (the paper label or cap), overriding the simple fake glass effect for accurate material separation.
4. **Ultra Realism (4 Maps):** The final step. Adds the **Ambient Occlusion (AO) Map**, simulating micro-shadows in deep crevices like the ridges under the bottle cap, giving it a heavy, grounded presence.

### Why do this?
*   **Insanely Fast:** A flat plane with 4 image textures loads instantly compared to parsing a heavy `.gltf` 3D geometry file.
*   **Performance:** Consumes a fraction of the GPU/CPU power.
*   **Interactive:** When you move your mouse, a `<pointLight>` follows the cursor. The `<meshPhysicalMaterial>` calculates real-time reflections and shadows across the Normal and Roughness maps, making the flat image look undeniably 3D. Add in the environment map reflections, and the illusion is complete.

## Tech Stack 🛠

*   [Next.js](https://nextjs.org/)
*   [React](https://react.dev/)
*   [Three.js](https://threejs.org/)
*   [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction)
*   [@react-three/drei](https://github.com/pmndrs/drei)

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser. Move your mouse around the bottle to see the 2.5D lighting in action!
