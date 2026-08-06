import { copyFile, mkdir, stat } from 'node:fs/promises';
import { resolve } from 'node:path';

const paquetes = {
  hands: [
    'hands.binarypb',
    'hands.js',
    'hands_solution_packed_assets.data',
    'hands_solution_packed_assets_loader.js',
    'hands_solution_simd_wasm_bin.data',
    'hands_solution_simd_wasm_bin.js',
    'hands_solution_simd_wasm_bin.wasm',
    'hands_solution_wasm_bin.js',
    'hands_solution_wasm_bin.wasm',
    'hand_landmark_full.tflite',
    'hand_landmark_lite.tflite',
  ],
  camera_utils: ['camera_utils.js'],
  drawing_utils: ['drawing_utils.js'],
};

const raiz = process.cwd();

for (const [paquete, archivos] of Object.entries(paquetes)) {
  const origen = resolve(raiz, 'node_modules', '@mediapipe', paquete);
  const destino = resolve(raiz, 'public', 'vendor', 'mediapipe', paquete);
  await mkdir(destino, { recursive: true });

  for (const archivo of archivos) {
    const archivoOrigen = resolve(origen, archivo);
    const archivoDestino = resolve(destino, archivo);
    await stat(archivoOrigen);
    await copyFile(archivoOrigen, archivoDestino);
  }
}

console.log('MediaPipe local preparado en public/vendor/mediapipe.');
