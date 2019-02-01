import Vue from 'vue';

const state = [

];

const getters = {
  tags: state =>
    state.reduce((obj, item) => {
      const { tags } = item;
      tags.forEach((tag) => {
        if (!obj[tag]) obj[tag] = 1;
        else obj[tag] += 1;
      });

      return obj;
    }, {}),

  done: state => state.filter(card => card.done),
  notDone: state => state.filter(card => !card.done),
  types: state =>
    state.reduce((obj, item) => {
      const { type } = item;
      if (!obj[type]) obj[type] = 1;
      else obj[type] += 1;

      return obj;
    }, {}),
};

function addCard(commit, card, resolve, reject) {
  const required = ['title', 'type'];

  for (let i = 0; i < required.length; i += 1) {
    const prop = required[i];
    if (!Object.prototype.hasOwnProperty.call(card, prop)) {
      reject(new Error(`Missing required property "${prop}"`));
      return;
    }
  }

  commit('add', card);
  resolve();
}

const actions = {
  add({ commit }, card) {
    return new Promise((resolve, reject) => {
      if (Array.isArray(card)) {
        card.forEach(c => addCard(commit, c, resolve, reject));
      } else {
        addCard(commit, card, resolve, reject);
      }
    });
  },
};

const mutations = {
  add(state, card) {
    state.push(card);
  },

  update(state, { index, card }) {
    Vue.set(state, index, Object.assign({}, state[index], card));
  },

  remove(state, { index }) {
    state.splice(index, 1);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
