import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
    build: {
        cssCodeSplit: true,
        lib: {
            entry: resolve(__dirname, 'src/index.js'),
            name: 'JSComponent',
            fileName: format => `index.${format}.js`
        }
    }
})
