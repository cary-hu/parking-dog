// uno.config.ts
import {
  defineConfig, presetAttributify, presetUno,
} from 'unocss'

export default defineConfig({
  shortcuts: [
    // ...
  ],
  theme: {
    colors: {
      // ...
    },
    container: {
      center: true,
    },
  },
  presets: [
    presetUno(),
    presetAttributify(),
  ],
})
