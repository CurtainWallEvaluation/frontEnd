import './assets/main.css'

import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import echarts from "@/echarts.js";

import ECharts from 'vue-echarts'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import myAxios from './axios.js'
import 'element-plus/dist/index.css'

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.config.globalProperties.$echarts = echarts;
app.provide('$echarts', echarts);

// 全局挂载axios
app.config.globalProperties.$axios = myAxios;

app.use(router)
app.use(ElementPlus, { size: 'small', zIndex: 3000 })

app.component('v-chart', ECharts)

app.mount('#app')
