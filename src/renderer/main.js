import Vue from 'vue';
import axios from 'axios';

import { VueMasonryPlugin } from 'vue-masonry/index';
import { library } from '@fortawesome/fontawesome-svg-core';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Theme from '@/theme';
import store from '@/store';

import App from './App';
import router from './router';

if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.http = Vue.prototype.$http = axios;
Vue.config.productionTip = false;


library.add(far);
library.add(fas);

Vue.component('icon', FontAwesomeIcon);
Vue.config.productionTip = false;

Vue.use(VueMasonryPlugin);

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>',
  mounted() {
    this.$theme = new Theme();
    this.$theme.install();
    this.$theme.start();
  },
}).$mount('#app');

