/*
 * Vite build configuration for Floop Feedback Tools.
 * Project code written for this application.
 *
 * External tool dependencies (devDependencies in package.json):
 *   - Vite              https://vitejs.dev              (build tool and dev server)
 *   - @vitejs/plugin-react  https://github.com/vitejs/vite-plugin-react
 *                                                       (Babel-based JSX transform)
 *
 * This file configures the build only; no Vite or plugin source code
 * has been copied into this file.
 * Author: John E. Parman
 */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
    plugins: [react()],
    build: {
        outDir: 'assets/dist',
        emptyOutDir: true,
        rollupOptions: {
            input: {
                drawback: resolve(__dirname, 'src/drawback.jsx'),
                gallery: resolve(__dirname, 'src/gallery.jsx'),
                'totes-emote': resolve(__dirname, 'src/totes-emote.jsx'),
                main: resolve(__dirname, 'src/main.js'),
            },
            output: {
                entryFileNames: 'js/[name].js',
                chunkFileNames: 'js/shared-[hash].js',
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name && assetInfo.name.endsWith('.css')) {
                        return 'css/[name][extname]';
                    }
                    return 'assets/[name][extname]';
                },
            },
        },
    },
});
