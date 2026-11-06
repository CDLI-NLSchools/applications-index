import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const root = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  // Use relative paths so the site works when served from a subpath (GitHub Pages)
  base: './',
  build: {
    rollupOptions: {
      input: {
        main: resolve(root, 'index.html'),
        drafts: resolve(root, 'drafts.html')
      }
    }
  }
})
