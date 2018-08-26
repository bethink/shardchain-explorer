// database history

const state = {
  databaseList: {},
  currentDatabase: null
}

const mutations = {
  ADD_DATABASE (state, db) {
    state.databaseList[db] = 1
  },

  SET_CURRENT_DATABASE (state, db) {
    state.currentDatabase = db
    console.debug('store.databases.SET_CURRENT_DATABASE:', db)
  }
}

const actions = {
  setCurrentDatabase ({ commit }, payload) {
    commit('SET_CURRENT_DATABASE', payload)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
