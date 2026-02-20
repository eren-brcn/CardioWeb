import { defineConfig } from 'vite'
import react from '@vitejs/react-swc'


export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['cardioweb.onrender.com'] 
  }
})