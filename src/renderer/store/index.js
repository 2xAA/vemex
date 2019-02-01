import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersist from 'vuex-persistfile';
import ospath from 'ospath';
import path from 'path';

// import { createPersistedState, createSharedMutations } from 'vuex-electron';

import modules from './modules';

Vue.use(Vuex);

const persist = new VuexPersist({
  path: path.join(ospath.data(), 'vemex'),
  reducer: state => ({
    cards: state.cards,
  }),
});

export default new Vuex.Store({
  modules,
  plugins: [
    // createPersistedState(),
    // createSharedMutations(),
    persist.subscribe(),
  ],
  strict: process.env.NODE_ENV !== 'production',
});
