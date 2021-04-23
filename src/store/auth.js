import _ from 'lodash'

const defaultState = {
  hasRequstedSmsVerificationCode: false,
  numberOfSmsVerificationAttemptsRemaining: null,
  isBlocked: false,
  errorMessage: null,

  isVerified: false,
  isWaitlisted: false,
  isOnboarding: false,
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
}

export default {
  namespaced: true,
  state: _.cloneDeep(defaultState),
  getters: {
    hasRequstedSmsVerificationCode: state => state.hasRequstedSmsVerificationCode == true,
    numberOfSmsVerificationAttemptsRemaining: state => state.numberOfSmsVerificationAttemptsRemaining,
    isBlocked: state => state.isBlocked === true,
    isOnboarding: state => state.isOnboarding === true,
    isWaitlisted: state => state.isWaitlisted === true,
    isVerified: state => state.isVerified === true,
    profilePhotoUrl: state => state.user.photoUrl,
    authToken: state => state.tokens.auth,
    userId: state => state.user.id,
    name: state => state.user.name,
  },
  mutations: {
    UPDATE_SIGN_IN_ATTEMPT_STATE: (state, response) => {
      state.hasRequstedSmsVerificationCode = response.success
      state.isBlocked = response.is_blocked
      state.errorMessage = response.error_message
    },
    UPDATE_COMPLETE_SIGN_IN_ATTEMPT_STATE: (state, data) => {
      const hasAttemptsRemaining = _.has(data, 'number_of_attempts_remaining')
      const isVerified = _.get(data, 'is_verified')
      if (hasAttemptsRemaining && !isVerified) {
        state.numberOfSmsVerificationAttemptsRemaining = data.number_of_attempts_remaining
        state.isVerified = isVerified
      } else {
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
      }
    },
    UPDATE_PHOTO_URL (state, photoUrl) {
      state.user.photoUrl = photoUrl
    },
    RESET: (state) => {
      Object.assign(state,_.cloneDeep(defaultState))
    },
    MARK_AS_ONBOARD: (state) => {
      state.isOnboarding = false
    },
    MARK_AS_INVITED: (state) => {
      state.isWaitlisted = false
    },
  },
  actions: {
    //
  },
}
