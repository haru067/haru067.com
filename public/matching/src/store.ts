import Vue from "vue";
import Vuex from 'vuex'
import { config, Config } from './config'

Vue.use(Vuex)

interface State { participants: string[], config: Config };
const state: State = {
    participants: [],
    config: config,
};

const mutations = {
    updateParticipants(state: State, participants: string[]) {
        state.participants = participants;
    }
}

const actions = {
    updateParticipants: ({ commit }: any, participants: string[]) => commit('updateParticipants', participants),
}

const getters = {
    participants: (state: State) => state.participants,
}

export default new Vuex.Store({
    state,
    getters,
    actions,
    mutations
});