import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Ensures assets load correctly from the /bolivar-flowmodoro/ subfolder
  base: '/bolivar-flowmodoro/', 
})
