import axios from 'src/ajax'

export default {
  namespaced: true,
  state: {
    awaitingSmsVerificationCode: false,
    isBlocked: false,
    errorMessage: null,
    authData: {},
  },
  getters: {
    getIsAwaitingSmsVerificationCode: state => {
      return state.awaitingSmsVerificationCode
    },
  },
  mutations: {
    UPDATE_SIGN_IN_ATTEMPT_STATE: (state, response) => {
      state.awaitingSmsVerificationCode = response.success
      state.isBlocked = response.is_blocked
      state.errorMessage = response.error_message
    },
    SET_USER_AUTH_DATA: (state, authData) => {
      state.authData = authData
    },
  },
  actions: {
    startPhoneNumberAuth: ({ commit }, phoneNumber) => {
      const url = 'start_phone_number_auth'
      const data = {
        phone_number: phoneNumber,
      }
      return axios
        .post(url, data)
        .then(res => commit('UPDATE_SIGN_IN_ATTEMPT_STATE', res.data))
        .catch(() => {})
    },
    completePhoneNumberAuth: ({ commit }, phoneNumber, verificationCode) => {
      const url = 'complete_phone_number_auth'
      const data = {
        phone_number: phoneNumber,
        verification_code: verificationCode,
      }
      return axios
        .post(url, data)
        .then(res => commit('SET_USER_AUTH_DATA', res.data))
        .catch(() => {})
    },
  },
}
