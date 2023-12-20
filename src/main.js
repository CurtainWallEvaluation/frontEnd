import './assets/main.css'

import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import echarts from "@/echarts.js";

const app = createApp(App)

app.config.globalProperties.$echarts = echarts;
app.provide('$echarts', echarts);

app.use(router)

app.mount('#app')
