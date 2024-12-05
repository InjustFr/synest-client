import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
import mkcert from 'vite-plugin-mkcert'

// https://vite.dev/config/
export default defineConfig({
    server: {
        port: 7000,
        proxy: {
            '/api': {
                target: 'https://localhost:6001',
                secure: false,
                rewrite: (path: string) => path.replace(/^\/api/, ''),
            },
        },
    },
    plugins: [
        vue(),
        vueDevTools(),
        mkcert(),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
});
