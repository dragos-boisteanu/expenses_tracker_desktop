import './assets/main.css'
import 'overlayscrollbars/overlayscrollbars.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import dayjs from '@/plugins/dayjs'
import { DayjsKey } from './plugins/dayjsKey'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.provide(DayjsKey, dayjs)

app.use(createPinia())
app.use(router)

console.log('main', app)
app.mount('#app')
