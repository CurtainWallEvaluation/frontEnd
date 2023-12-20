import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import ECharts from 'vue-echarts'
import ElementPlus from 'element-plus'

const app = createApp(App)

app.use(router)
app.use(ElementPlus, { size: 'small', zIndex: 3000 })

app.component('v-chart', ECharts)

app.mount('#app')
