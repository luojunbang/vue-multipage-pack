import Vue from 'vue'
import nofound from './nofound.vue'

Vue.config.productionTip = false
const root=document.createElement("div")
document.body.appendChild(root)

new Vue({
    render:h=>h(nofound)
}).$mount(root)