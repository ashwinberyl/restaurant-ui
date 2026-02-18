import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    server: {
        port: 3000,
        proxy: {
            '/api/tables': {
                target: 'http://localhost:5001',
                changeOrigin: true,
            },
            '/api/reservations': {
                target: 'http://localhost:5002',
                changeOrigin: true,
            },
        },
    },
});
