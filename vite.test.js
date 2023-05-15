import { defineConfig } from 'vite'
import eslint from 'vite-plugin-eslint'

export default defineConfig({
  publicDir: '__test__',
  plugins: [
    eslint({
      include: ['**/*.js'],
      exclude: [
        '**/node_modules/**',
        '.eslintrc.js',
        'dist/**/*.js'
      ]
    })
  ]
})
