import { defineConfig } from 'vite'
import react from '@vitejs/react-web'

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['cardioweb.onrender.com']
  }
})