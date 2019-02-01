const state = {
  tag: [],
  type: [],
  done: -1,
  project: [],
};

const getters = {};

const actions = {};

function insertOrDelete(state, key, value) {
  if (state[key].indexOf(value) > -1) {
    state[key].splice(state[key].indexOf(value), 1);
  } else {
    state[key].push(value);
  }
}

const mutations = {
  toggleTag(state, { tag }) {
    if (Array.isArray(tag)) tag.forEach(insertOrDelete(state, 'tag', tag));
    else insertOrDelete(state, 'tag', tag);
  },

  toggleType(state, { type }) {
    if (Array.isArray(type)) type.forEach(insertOrDelete(state, 'type', type));
    else insertOrDelete(state, 'type', type);
  },

  toggleProject(state, { project }) {
    if (Array.isArray(project)) project.forEach(insertOrDelete(state, 'project', project));
    else insertOrDelete(state, 'project', project);
  },

  setDone(state, { done }) {
    state.done = done;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
