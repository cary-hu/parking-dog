import UnoCSS from 'unocss/vite'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    UnoCSS(),
    Components({
      dirs: ['src'],
    }),
    vue(),
    AutoImport({
      imports: ['vue', 'vue-router'],
    }),
  ],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
