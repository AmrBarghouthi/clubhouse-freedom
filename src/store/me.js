const defaultStateFactory = () => {
  return {
    user: {
      id: null,
      name: null,
      photoUrl: null,
      username: null,
    },
    blockedIds: null,
    followingIds: null,
    hasUnreadNotifications: null,
    notificationsEnabled: null,
    actionableNotificationsCount: null,
    actionableNotificationsCountByType: null,
    invitesCount: null,
    email: null,
    featureFlags: null,
    isAdmin: null,
  }
}

export default {
  namespaced: true,
  state: defaultStateFactory(),
  mutations: {
    RESET: state => Object.assign(state, defaultStateFactory()),
    SET: (state, payload) => {
      state.user.id = payload.user_profile.user_id
      state.user.name = payload.user_profile.name
      state.user.photoUrl = payload.user_profile.photo_url
      state.user.username = payload.user_profile.username
      state.blockedIds = payload.blocked_ids
      state.followingIds = payload.following_ids
      state.hasUnreadNotifications = payload.has_unread_notifications
      state.notificationsEnabled = payload.notifications_enabled
      state.actionableNotificationsCount = payload.actionable_notifications_count
      state.actionableNotificationsCountByType = payload.actionable_notifications_count_by_type
      state.invitesCount = payload.num_invites
      state.email = payload.email
      state.featureFlags = payload.feature_flags
      state.isAdmin = payload.is_admin
    },
    INSERT_IN_FOLLOWING: (state, payload) => {
      if (!state.followingIds.includes(payload.userId)) {
        state.followingIds.push(payload.userId)
      }
    },
    REMOVE_FROM_FOLLOWING: (state, payload) => {
      const index = state.followingIds.findIndex(id => id === payload.userId)
      if (index !== -1) {
        state.followingIds.splice(index, 1)
      }
    },
  },
}
