import UnoCSS from 'unocss/vite'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
import { VueAmapResolver } from '@vuemap/unplugin-resolver'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    UnoCSS(),
    Components({
      dirs: ['src'],
      resolvers: [VueAmapResolver()],
    }),
    vue(),
    vuetify({ autoImport: true }),
    AutoImport({
      imports: ['vue', 'vue-router'],
      resolvers: [VueAmapResolver()],
    }),
  ],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
