import axios from 'src/ajax'

export default {
  namespaced: true,
  state: {
    channels: [],
  },
  getters: {
    channels: state => state.channels,
  },
  mutations: {
    SET_CHANNELS: (state, payload) => {
      state.channels = payload.channels
    },
  },
  actions: {
    getChannels: ({ commit, rootGetters }) => {
      const authToken = rootGetters['auth/authToken']
      const userId = rootGetters['auth/userId']
      const url = 'get_channels'
      const options = {
        headers: {
          Authorization: `Token ${authToken}`,
          'CH-UserID': userId,
        },
      }
      axios.get(url, options)
        .then(res => {
          console.log(res)
          commit('SET_CHANNELS', {
            channels: res.data.channels,
          })
        })
        .catch(err => {
          console.log(err)
          console.log(err.response)
        })
    },
  },
}
