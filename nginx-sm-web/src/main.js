import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import axios from 'axios';
import './scss/index.scss';
import 'bootstrap';

import ReCaptcha from './components/ReCaptcha';

Vue.component('ReCaptcha', ReCaptcha);
Vue.config.productionTip = false

axios.interceptors.request.use(config => {
  if (store.state.token) {
    config.headers.Authorization = store.state.token;
  }
  return config;
});

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
