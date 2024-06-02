# MarchingCubes.JS

Implementation of marching cubes mesh generation algorithm within Three.JS.
Inspired by Paul Bourke's: "Polygonising a scalar field" (1996).
https://paulbourke.net/geometry/polygonise/

## How to use

Import MarchingGrid class.
```JavaScript
import { MarchingGrid } from 'MarchingCubes.js';
```

Initialise MarchingGrid with position, dimensions, and material,
generate the mesh, and add it to a scene.
```JavaScript
const grid = new MarchingGrid(position, dimensions, material);
grid.genMesh();
grid.add(scene, true, false);
```

