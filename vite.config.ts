/// <reference types="vitest" />

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

// @ts-expect-error vite-plugin-eslint has some types issue for typescript 5
import eslint from 'vite-plugin-eslint'
import checker from 'vite-plugin-checker'
import path from 'path'
import { version } from './package.json'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr(), eslint(), checker({ typescript: true })],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    'import.meta.env.APP_VERSION': JSON.stringify(version),
  },
})
