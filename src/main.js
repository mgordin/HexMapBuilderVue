import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { plugin as VueTippy } from 'vue-tippy'

import App from './App.vue'
//import router from './router'

const app = createApp(App)

app.use(createPinia())
//app.use(router)

app.use(
    VueTippy,
    // optional
    {
      directive: 'tippy', // => v-tippy
      component: 'tippy', // => <tippy/>
      componentSingleton: 'tippy-singleton', // => <tippy-singleton/>,
      defaultProps: {
        allowHTML: true
      }, // => Global default options * see all props
    }
  )

app.mount('#app')
