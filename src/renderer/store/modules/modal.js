const state = {
  open: false,
  content: '',
  type: '',
};

const getters = {};

const actions = {
  open({ commit }, { content, type }) {
    if (content) {
      commit('setContent', { content });
    }

    if (type) {
      commit('setType', { type });
    }

    commit('setOpen', { open: true });
  },
  close({ commit }) {
    commit('setOpen', { open: false });
  },
};

const mutations = {
  setContent(state, { content }) {
    state.content = content;
  },
  setType(state, { type }) {
    state.type = type;
  },
  setOpen(state, { open }) {
    state.open = open;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
