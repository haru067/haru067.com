import Vue from "vue";
import Vuex from 'vuex'
import { config, Config } from './config'

Vue.use(Vuex)

type User = string | null;
interface State { user: User, config: Config };

const state: State = {
    user: null,
    config: config,
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