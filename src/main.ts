import { createApp } from 'vue'
import VueAMap, { initAMapApiLoader } from '@vuemap/vue-amap'
import '@vuemap/vue-amap/dist/style.css'
import { createVuetify } from 'vuetify'
import App from './App.vue'
import router from '@/router'
import 'vuetify/styles'
import './styles/main.scss'
import 'virtual:uno.css'

const vuetify = createVuetify()
const app = createApp(App)
app.use(VueAMap)
initAMapApiLoader({
  key: '84f68eb90ca4277c0cd941f2d7ec427d',
  securityJsCode: 'a1ca147434fe40aed17218cfa37adfda',
})
app.use(router)
app.use(vuetify)
app.mount('body')
