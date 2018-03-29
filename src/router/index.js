import Vue from 'vue';
import Router from 'vue-router';
import Index from '@/pages/Index';
Vue.use(Router);
Vue.filter('keepTwoNum',val=>{
  val = Number(val);
return val.toFixed(2);
});

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index,
    },
  ]
});