import Vue from "vue";
import Vuex from 'vuex'
import { config, Config } from './config'
import { Participant, Group } from './entity'

Vue.use(Vuex)

interface State {
    participants: Participant[],
    groupSize: number,
    groups: Group[],
    config: Config
};
const state: State = {
    participants: [],
    groupSize: 4,
    groups: [],
    config: config,
};

const mutations = {
    updateParticipants(state: State, participants: string[]) {
        state.participants = participants.map((name: string, index: number) => {return {id: index, name: name}});
    },
    updateGroupSize(state: State, groupSize: number) {
        // TODO: define validator
        groupSize = Math.min(groupSize, 99);
        groupSize = Math.max(groupSize, 1);
        groupSize = isNaN(groupSize) ? 1 : groupSize;

        state.groupSize = groupSize;
    },
    allocateParticipants(state: State) {
        state.groups = [];
        // Shuffle
        const shuffled = state.participants.slice().sort(() => Math.random()-.5);
        const numGroups = Math.ceil(state.participants.length / state.groupSize);
        for (let i = 0; i < numGroups; i++) {
            const id = i;
            const suffix = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; 
            const name = `Group ${suffix.charAt(i % suffix.length)}`; // Group0 -> Group A, Group1 -> Group B, ...
            let participants = [];
            for (let j = 0; j < state.groupSize; j++) {
                const added = shuffled[i * state.groupSize + j];
                if (!added) break;
                participants.push(added);
            }
            state.groups.push({id, name, participants});
        }
    },
}

const actions = {
    updateParticipants: ({ commit }: any, participants: string[]) => commit('updateParticipants', participants),
    updateGroupSize: ({ commit }: any, groupSize: number) => commit('updateGroupSize', groupSize),
    allocateParticipants: ({ commit }: any) => commit('allocateParticipants'),
}

const getters = {
    participants: (state: State) => state.participants,
    groupSize: (state: State) => state.groupSize,
    groups: (state: State) => state.groups,
    config: (state: State) => state.config,
}

export default new Vuex.Store({
    state,
    getters,
    actions,
    mutations
});