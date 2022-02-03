import loginService from '../service/LoginService';

const user = JSON.parse(localStorage.getItem('user'));
const initialState = user
  ? { status: { loggedIn: true }, user }
  : { status: { loggedIn: false }, user: null };

export const auth = {
  namespaced: true,
  state: initialState,
  actions: {
    login({ commit }, user) {
      return loginService.loginUser(user).then(
        user => {
          if(user.data.success){
            localStorage.setItem('user',JSON.stringify(user.data.data))
             commit('loginSuccess', user.data.data);
             return Promise.resolve(user.data.data);
          }
          return Promise.resolve(null);
        },
        error => {
          commit('loginFailure');
          return Promise.reject(error);
        }
      );
    },
  },
  mutations: {
    loginSuccess(state, user) {
      state.status.loggedIn = true;
      state.user = user;
    },
    loginFailure(state) {
      state.status.loggedIn = false;
      state.user = null;
    },
  }
};