import Vue from "vue";
import Vuex from 'vuex'
import { config, Config } from './config'

Vue.use(Vuex)

interface State {
    participants: string[],
    groupSize: number,
    config: Config
};
const state: State = {
    participants: [],
    groupSize: 4,
    config: config,
};

const mutations = {
    updateParticipants(state: State, participants: string[]) {
        state.participants = participants;
    },
    updateGroupSize(state: State, groupSize: number) {
        // TODO: define validator
        groupSize = Math.min(groupSize, 99);
        groupSize = Math.max(groupSize, 1);
        groupSize = isNaN(groupSize) ? 1 : groupSize;

        state.groupSize = groupSize;
    }
}

const actions = {
    updateParticipants: ({ commit }: any, participants: string[]) => commit('updateParticipants', participants),
    updateGroupSize: ({ commit }: any, groupSize: number) => commit('updateGroupSize', groupSize),
}

const getters = {
    participants: (state: State) => state.participants,
    groupSize: (state: State) => state.groupSize,
}

export default new Vuex.Store({
    state,
    getters,
    actions,
    mutations
});