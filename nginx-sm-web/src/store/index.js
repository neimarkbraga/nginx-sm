import Vue from 'vue';
import Vuex from 'vuex';
import jwt from 'jsonwebtoken';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: localStorage.getItem('APP_USER_TOKEN') || ''
  },
  getters: {
    getUser(state) {
      try {
        return jwt.decode(state.token);
      }
      catch (e) {
        return null;
      }
    }
  },
  mutations: {
    setToken(state, token) {
      localStorage.setItem('APP_USER_TOKEN', token);
      state.token = token;
    }
  }
});