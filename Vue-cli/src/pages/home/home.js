import Vue from 'vue'
import home from './home.vue'
import store from '../../store'
import router from '../../router'


Vue.config.productionTip = false


new Vue({
    router,
    store,
    render:h=>h(home)
}).$mount('#home-app')