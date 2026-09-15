import { defineConfig } from 'vite';
import { cp } from 'node:fs/promises';
import { resolve } from 'node:path';

export default defineConfig({
    server: { host: '0.0.0.0' },
    plugins: [{
        name: 'copy-runtime-files',
        apply: 'build',
        async closeBundle() {
            // Classic scripts and blog resources are loaded at runtime.
            for (const path of ['scripts', 'blogs', 'assets', 'ads.txt']) {
                await cp(resolve(import.meta.dirname, path), resolve(import.meta.dirname, 'dist', path), { recursive: true });
            }
        },
    }],
    build: {
        rollupOptions: {
            input: { index: 'index.html', blog: 'blog.html', 'blog-post': 'blog-post.html', friends: 'friends.html', support: 'support.html' },
        },
    },
});
