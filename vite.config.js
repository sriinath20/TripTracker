import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Increase the warning limit to 2000kb (2MB)
    // This silences the warning for heavy libraries like jsPDF
    chunkSizeWarningLimit: 2000,
  },
})