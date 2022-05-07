import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { plugin as VueTippy } from 'vue-tippy'

import FloatingVue from 'floating-vue'


import App from './App.vue'
//import router from './router'


const app = createApp(App)

app.use(createPinia())
//app.use(router)

app.config.unwrapInjectedRef = true

app.mount('#app')
