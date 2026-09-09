import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig(({ command }) => ({
  plugins: [react()],
  // GitHub Pages needs /AquaShield/, while local Vite must use /
  base: command === 'build' ? '/AquaShield/' : '/',
}))
