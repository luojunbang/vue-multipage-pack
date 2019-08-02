import Vue from 'vue'
import about from './about.vue'

Vue.config.productionTip = false
const root=document.createElement("div")
document.body.appendChild(root)

new Vue({
    render:h=>h(about)
}).$mount(root)