const defaultStateFactory = () => {
  return {
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
}

export default {
  namespaced: true,
  state: defaultStateFactory(),
  getters: {
    isBlocked: state => state.isBlocked === true,
    isOnboarding: state => state.isOnboarding === true,
    isWaitlisted: state => state.isWaitlisted === true,
    isVerified: state => state.isVerified === true,
    profilePhotoUrl: state => state.user.photoUrl,
    authToken: state => state.tokens.auth,
    userId: state => state.user.id,
    name: state => state.user.name,
    username: state => state.user.username,
  },
  mutations: {
    RESET: state => Object.assign(state, defaultStateFactory()),
    SET_SUCCESSFUL_SIGNIN_DATA: (state, data) => {
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
    UPDATE_NAME: (state, name) => state.user.name = name,
    UPDATE_USERNAME: (state, username) => state.user.username = username,
    UPDATE_PHOTO_URL: (state, photoUrl) => state.user.photoUrl = photoUrl,
  },
}
