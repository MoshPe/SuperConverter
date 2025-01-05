import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import * as path from "node:path";

// https://vitejs.dev/config/
export default defineConfig({
  // build: {
  //   rollupOptions: {
  //     external: ["cesium"]
  //   }
  // },
  // server: {
  //   fs: {
  //     allow: [
  //       path.resolve(__dirname, "node_modules/cesium/Build/Cesium")
  //     ]
  //   }
  // },
  // base: '/',
  // publicDir: 'public',
  plugins: [react()]
})
