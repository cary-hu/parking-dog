import { createApp } from 'vue'
import { createVuetify } from 'vuetify'
import App from './App.vue'
import router from '@/router'
import 'vuetify/styles'
import './styles/main.scss'
import 'virtual:uno.css'

const vuetify = createVuetify()
const app = createApp(App)
app.use(router)
app.use(vuetify)
app.mount('body')
