import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
//换肤处理
import './assets/style/color.less'
Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')