import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

import VueSimpleAlert from 'vue-simple-alert';

Vue.config.productionTip = false;
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.use(VueSimpleAlert);

// Restaurar sessão se existir token guardado
store.dispatch('auth/restore').catch(() => store.dispatch('auth/logout'));

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app');
