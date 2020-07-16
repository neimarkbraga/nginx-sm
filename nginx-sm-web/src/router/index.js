import Vue from 'vue';
import VueRouter from 'vue-router';

import Home from '../views/Home';
import Login from '../views/Login';
import PageNotFound from '../views/PageNotFound';

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: Home
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '*',
      component: PageNotFound
    }
  ]
});

export default router;