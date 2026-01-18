import { defineConfig } from 'vite'
import react from '@vitejs/react-swc'

export default defineConfig({
  plugins: [react()],
  // Essential: Tells the browser where to find assets on GitHub Pages
  base: '/bolivar-flowmodoro/', 
})