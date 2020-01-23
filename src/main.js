import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import acl from './plugins/acl';
import apolloProvider from './plugins/apollo-vue'
import router  from './routes';
import store from './store';
import * as Helper from './Helpers';

Vue.prototype.Helper = Helper;
Vue.config.productionTip = true;

new Vue({
  apolloProvider,
  vuetify,
  store,
  router,
  acl,
  render: h => h(App)
}).$mount('#app')
