import { fileURLToPath, URL } from 'node:url';

import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
import mkcert from 'vite-plugin-mkcert';

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
    const env = loadEnv(mode, process.cwd(), 'VITE_') as unknown as {
        readonly VITE_PORT: number;
        readonly VITE_API_URL: string;
    };

    return {
        server: {
            host: '0.0.0.0',
            port: env.VITE_PORT,
            proxy: {
                '/api': {
                    target: env.VITE_API_URL,
                    secure: false,
                    rewrite: (path: string) => path.replace(/^\/api/, ''),
                    xfwd: true,
                },
            },
            https: true,
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
    };
});
