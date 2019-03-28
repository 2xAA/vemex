import callAgent from '@/call-agent';

const state = {
  directoryPath: '',
};

const getters = {};

const actions = {
  async getDirectoryPath({ commit }) {
    const path = await callAgent('mediaDirectoryPath');
    commit('setDirectoryPath', { path });
    return path;
  },
};

const mutations = {
  setDirectoryPath(state, { path }) {
    state.directoryPath = path;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
