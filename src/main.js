// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import axios from 'axios';
import { DatetimePicker,Button} from 'mint-ui';
import App from './App';
import store from './store';
import router from './router';
import rem from './utils/rem';
import './utils/config';
import vuex from 'vuex';
// import doAuthorize from './utils/authorize';
Vue.component(DatetimePicker.name,DatetimePicker);
Vue.component(Button.name,Button);

store.dispatch('changeFont',1/rem())

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
});



