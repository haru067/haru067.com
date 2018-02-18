import Vue from "vue";
import Vuex from 'vuex'

Vue.use(Vuex)

type User = firebase.User | null;
interface State { user: User };

const state: State = {
    user: null
};

const mutations = {
    updateUser(state: State, user: User) {
        console.log('user updated:');
        console.log(user);
        state.user = user;
    }
}

const actions = {
    updateUser: ({ commit }: any, user: User) => commit('updateUser', user),
}
  
const getters = {
    user: (state: State) => state.user,
}

export default new Vuex.Store({
    state,
    getters,
    actions,
    mutations
  })