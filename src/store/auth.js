import axios from 'src/ajax'
import _ from 'lodash'

export default {
  namespaced: true,
  state: {
    hasRequstedSmsVerificationCode: null,
    numberOfSmsVerificationAttemptsRemaining: null,
    isBlocked: null,
    errorMessage: null,

    isVerified: null,
    isWaitlisted: null,
    isOnboarding: null,
    user: {
      id: null,
      username: null,
      name: null,
      photoUrl: null,
    },
    tokens: {
      auth: null,
      refresh: null,
      access: null,
    },
  },
  getters: {
    hasRequstedSmsVerificationCode: state => state.hasRequstedSmsVerificationCode == true,
    numberOfSmsVerificationAttemptsRemaining: state => state.numberOfSmsVerificationAttemptsRemaining,
    canEnterSmsVerificationCode: state => state.hasRequstedSmsVerificationCode && state.numberOfSmsVerificationAttemptsRemaining !== 0,
    isOnboarding: state => state.isOnboarding === true,
    isWaitlisted: state => state.isWaitlisted === true,
    isVerified: state => state.isVerified === true,
    signUpStage: state => {
      if (state.isOnboarding) {
        return 'ONBOARDING'
      }
      if (state.isWaitlisted) {
        return 'WAITLISTED'
      }
      if (state.isVerified) {
        return 'COMPLETED'
      }
      return 'NEW'
    },
    profilePhotoUrl: state => state.user.photoUrl,
    authToken: state => state.tokens.auth,
    userId: state => state.user.id,
  },
  mutations: {
    UPDATE_SIGN_IN_ATTEMPT_STATE: (state, response) => {
      state.hasRequstedSmsVerificationCode = response.success
      state.isBlocked = response.is_blocked
      state.errorMessage = response.error_message
    },
    SET_USER_AUTH_DATA: (state, data) => {
      state.isVerified = data.is_verified
      state.isWaitlisted = data.is_waitlisted
      state.isOnboarding = data.is_onboarding
      state.user.id = data.user_profile.user_id
      state.user.username = data.user_profile.username
      state.user.name = data.user_profile.name
      state.user.photoUrl = data.user_profile.photo_url
      state.tokens.auth = data.auth_token
      state.tokens.access = data.access_token
      state.tokens.refresh = data.refresh_token
    },
    UPDATE_FAILED_SMS_VERIFICATION_ATTEMPT_STATE: (state, data) => {
      state.numberOfSmsVerificationAttemptsRemaining = data.numOfAttempts
      state.isVerified = data.isVerified
    },
    RESTART_AUTHENTICATION: (state) => {
      state.hasRequstedSmsVerificationCode = false
      state.numberOfSmsVerificationAttemptsRemaining = null
    },
  },
  actions: {
    startPhoneNumberAuth: ({ commit }, payload) => {
      const url = 'start_phone_number_auth'
      const data = {
        phone_number: payload.phoneNumber,
      }
      return axios
        .post(url, data)
        .then(res => commit('UPDATE_SIGN_IN_ATTEMPT_STATE', res.data))
        .catch(() => {})
    },
    callPhoneNumberAuth: (_, payload) => {
      const url = 'call_phone_number_auth'
      const data = {
        phone_number: payload.phoneNumber,
      }
      return axios
        .post(url, data)
        .then(res => {
          console.log({res})
        })
        .catch(err => {
          console.log({err})
        })
    },
    restartAuthenticaton: ({ commit }) => {
      commit('RESTART_AUTHENTICATION')
    },
    completePhoneNumberAuth: ({ commit }, payload) => {
      const url = 'complete_phone_number_auth'
      const data = {
        phone_number: payload.phoneNumber,
        verification_code: payload.verificationCode,
      }
      return axios
        .post(url, data)
        .then(res => {
          const hasAttemptsRemaining = _.has(res, 'data.number_of_attempts_remaining')
          const isVerified = _.get(res, data.is_verified)

          if (hasAttemptsRemaining && !isVerified) {
            commit('UPDATE_FAILED_SMS_VERIFICATION_ATTEMPT_STATE', {
              numOfAttempts: res.data.number_of_attempts_remaining,
              isVerified: false,
            })
            return
          }

          commit('SET_USER_AUTH_DATA', res.data)
        })
        .catch(() => {})
    },
  },
}
