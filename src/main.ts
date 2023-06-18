import { createApp } from 'vue'
import dayjs from 'dayjs'
import VueAMap, { initAMapApiLoader } from '@vuemap/vue-amap'
import '@vuemap/vue-amap/dist/style.css'
import { createVuetify } from 'vuetify'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import relativeTime from 'dayjs/plugin/relativeTime'
import App from './App.vue'
import router from '@/router'
import 'vuetify/styles'
import './styles/main.scss'
import 'virtual:uno.css'

const vuetify = createVuetify()
const app = createApp(App)

dayjs.extend(customParseFormat)
dayjs.extend(relativeTime)
app.config.globalProperties.$dayjs = dayjs
app.use(VueAMap)
initAMapApiLoader({
  key: '84f68eb90ca4277c0cd941f2d7ec427d',
  securityJsCode: 'a1ca147434fe40aed17218cfa37adfda',
})
app.use(router)
app.use(vuetify)
app.mount('body')
