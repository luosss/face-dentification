import { createApp } from 'vue'

import  router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import App from './App.vue'

import './assets/main.css'

createApp(App).use(router).use(ElementPlus).mount('#app')
