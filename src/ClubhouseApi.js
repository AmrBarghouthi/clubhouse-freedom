import Axios from 'axios'
import { machineIdSync } from 'node-machine-id'
export default class ClubhouseApi {

  constructor ({ credentials, onUnauthorizedError = null, onNetworkError = null }) {
    this.credentials = credentials
    this.onUnauthorizedError = onUnauthorizedError
    this.onNetworkError = onNetworkError
  }

  ajax (withAuthHeaders = true) {
    const instance = Axios.create({
      baseURL: 'https://www.clubhouseapi.com/api',
      headers: {
        'CH-AppBuild': '269',
        'CH-AppVersion':'0.1.25',
        'Content-Type':'application/json; charset=utf-8',
        'CH-Languages':'en-US',
        'CH-Locale':'en_US',
        'Accept':'application/json',
        'CH-DeviceId': machineIdSync(true),
      },
    })

    instance.interceptors.response.use(response => response,  error => {
      if (error?.message === 'Network Error' && typeof this.onNetworkError === 'function') {
        this.onNetworkError()
      }

      if (error?.response?.status === 401 && typeof this.onUnauthorizedError === 'function') {
        this.onUnauthorizedError()
      }

      return Promise.reject(error)
    })

    if (!withAuthHeaders) {
      return instance
    }

    instance.defaults.headers.common['CH-UserID'] = this.getUserId()
    instance.defaults.headers.common['Authorization'] = `Token ${this.getAuthToken()}`

    return instance
  }

  getCredentials () {
    if (this.credentials != null) {
      return (typeof this.credentials == 'function') ? this.credentials() : this.credentials
    } else {
      throw 'No credentials provided'
    }
  }

  getUserId () {
    return this.getCredentials().userId
  }

  getAuthToken () {
    return this.getCredentials().authToken
  }

  startPhoneNumberAuth (phoneNumber) {
    const data = {
      phone_number: phoneNumber,
    }
    const url = 'start_phone_number_auth'
    return new Promise((resolve, reject) => {
      this
        .ajax(false)
        .post(url, data)
        .then(res => resolve(res.data))
        .catch(err => reject(err))
    })
  }

  callPhoneNumberAuth (phoneNumber) {
    const data = {
      phone_number: phoneNumber,
    }
    const url = 'call_phone_number_auth'
    return new Promise((resolve, reject) => {
      this
        .ajax(false)
        .post(url, data)
        .then(res => resolve(res.data))
        .catch(err => reject(err))
    })
  }

  resendPhoneNumberAuth (phoneNumber) {
    const data = {
      phone_number: phoneNumber,
    }
    const url = 'resend_phone_number_auth'
    return new Promise((resolve, reject) => {
      this
        .ajax(false)
        .post(url, data)
        .then(res => resolve(res.data))
        .catch(err => reject(err))
    })
  }

  completePhoneNumberAuth (phoneNumber, verificationCode) {
    const data = {
      phone_number: phoneNumber,
      verification_code: verificationCode,
    }
    const url = 'complete_phone_number_auth'
    return new Promise((resolve, reject) => {
      this
        .ajax(false)
        .post(url, data)
        .then(res => resolve(res.data))
        .catch(err => reject(err))
    })
  }

  checkWaitlistStatus () {
    return new Promise((resolve, reject) => {
      this
        .ajax()
        .post('check_waitlist_status', {})
        .then(res => resolve(res.data))
        .catch(err => reject(err))
    })
  }

  getChannel (channel) {
    const data = {
      channel,
      channel_id: null,
    }

    return new Promise((resolve, reject) => {
      this
        .ajax()
        .post('get_channel', data)
        .then(res => resolve(res.data))
        .catch(err => reject(err))
    })
  }

  updatePhoto (photo) {
    const data = new FormData()
    data.append('file', photo, 'image.jpg')

    return new Promise((resolve, reject) => {
      this
        .ajax()
        .post('update_photo', data)
        .then(res => resolve(res.data))
        .catch(err => reject(err))
    })
  }

  joinChannel (channel) {
    return new Promise((resolve, reject) => {
      this
        .ajax()
        .post('join_channel', { channel })
        .then(res => resolve(res.data))
        .catch(err => reject(err))
    })
  }

  leaveChannel (channel) {
    const data = {
      channel,
      channel_id: null,
    }

    return new Promise((resolve, reject) => {
      this
        .ajax()
        .post('leave_channel', data)
        .then(res => resolve(res.data))
        .catch(err => reject(err))
    })
  }

  getProfile (userId) {
    return new Promise((resolve, reject) => {
      this
        .ajax()
        .post('get_profile', { user_id: userId })
        .then(res => resolve(res.data))
        .catch(err => reject(err))
    })
  }

  getChannels () {
    return new Promise((resolve, reject) => {
      this
        .ajax()
        .post('get_channels')
        .then(res => resolve(res.data))
        .catch(err => reject(err))
    })
  }

  updateUsername (username) {
    return new Promise((resolve, reject) => {
      this
        .ajax()
        .post('update_username', { username })
        .then(res => resolve(res.data))
        .catch(err => reject(err))
    })
  }

  updateName (name) {
    return new Promise((resolve, reject) => {
      this
        .ajax()
        .post('update_name', { name })
        .then(res => resolve(res.data))
        .catch(err => reject(err))
    })
  }

  refreshToken (refreshToken) {
    return new Promise((resolve, reject) => {
      this
        .ajax()
        .post('refresh_token', { refresh: refreshToken })
        .then(res => resolve(res.data))
        .catch(err => reject(err))
    })
  }

  updateBio (bio) {
    return new Promise((resolve, reject) => {
      this
        .ajax()
        .post('update_bio', { bio })
        .then(res => resolve(res.data))
        .catch(err => reject(err))
    })
  }

  acceptSpeakerInvite (channel, userId) {
    const data = {
      channel,
      user_id: userId,
    }

    return new Promise((resolve, reject) => {
      this
        .ajax()
        .post('accept_speaker_invite', data)
        .then(res => resolve(res.data))
        .catch(err => reject(err))
    })
  }

  rejectSpeakerInvite (channel, userId) {
    const data = {
      channel,
      user_id: userId,
    }

    return new Promise((resolve, reject) => {
      this
        .ajax()
        .post('reject_speaker_invite', data)
        .then(res => resolve(res.data))
        .catch(err => reject(err))
    })
  }

  audienceReply (channel, rasie = true, unraise = false) {
    const data = {
      channel,
      raise_hands: rasie,
      unraise_hands: unraise,
    }
    return new Promise((resolve, reject) => {
      this
        .ajax()
        .post('audience_reply', data)
        .then(res => resolve(res.data))
        .catch(err => reject(err))
    })
  }

  follow (userId, userIds = null, source = 4, sourceTopicId = null) {
    const data = {
      source_topic_id: sourceTopicId,
      user_ids: userIds,
      user_id: userId,
      source: source,
    }
    return new Promise((resolve, reject) => {
      this
        .ajax()
        .post('follow', data)
        .then(res => resolve(res.data))
        .catch(err => reject(err))
    })
  }

  unfollow (userId) {
    return new Promise((resolve, reject) => {
      this
        .ajax()
        .post('unfollow', { user_id: userId })
        .then(res => resolve(res.data))
        .catch(err => reject(err))
    })
  }

  getFollowing (userId, pageSize = 50, page = 1) {
    const query = `user_id=${userId}&page_size=${pageSize}&page=${page}`
    const url = `get_following?${query}`
    return new Promise((resolve, reject) => {
      this
        .ajax()
        .get(url)
        .then(res => resolve(res.data))
        .catch(err => reject(err))
    })
  }

  getFollowers (userId, pageSize = 50, page = 1) {
    const query = `user_id=${userId}&page_size=${pageSize}&page=${page}`
    const url = `get_followers?${query}`
    return new Promise((resolve, reject) => {
      this
        .ajax()
        .get(url)
        .then(res => resolve(res.data))
        .catch(err => reject(err))
    })
  }

}
