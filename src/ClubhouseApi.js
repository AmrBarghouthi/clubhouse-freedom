import ajax from './ajax'

export default class ClubhouseApi{

  constructor(credentials = null)
  {
    this.credentials = credentials
  }

  getCredentials() {
    if(this.credentials != null)
      return (typeof this.credentials == 'function')?this.credentials():this.credentials
    else
      throw 'No credentials provided'
  }

  getUserId(){
    return this.getCredentials().userId
  }

  getAuthtoken() {
    return this.getCredentials().authToken
  }

  getAuthHeaders() {
    return {
      'CH-UserID': this.getUserId(),
      'Authorization': `Token ${this.getAuthtoken()}`
    }
  }
  startPhoneNumberAuth(phoneNumber) {
    const data = {
      phone_number: phoneNumber
    }
    const url = 'start_phone_number_auth'
    return new Promise((resolve,reject) => {
      ajax.post(url, data)
      .then(res => resolve(res.data))
      .catch(err => reject(err))
    })
  }

  callPhoneNumberAuth(phoneNumber) {
    const data = {
      phone_number: phoneNumber
    }
    const url = 'call_phone_number_auth'
    return new Promise((resolve,reject) => {
      ajax.post(url, data)
      .then(res => resolve(res.data))
      .catch(err => reject(err))
    })  }

  resendPhoneNumberAuth(phoneNumber) {
    const data = {
      phone_number: phoneNumber
    }
    const url = 'resend_phone_number_auth'
    return new Promise((resolve,reject) => {
      ajax.post(url, data)
      .then(res => resolve(res.data))
      .catch(err => reject(err))
    })
  }

  completePhoneNumberAuth(phoneNumber,verificationCode) {
    const data = {
      phone_number: phoneNumber,
      verification_code: verificationCode
    }
    const url = 'complete_phone_number_auth'
    return new Promise((resolve,reject) => {
      ajax.post(url, data)
      .then(res => resolve(res.data))
      .catch(err => reject(err))
    })
  }

  checkWaitlistStatus(phoneNumber,verificationCode) {
    const headers = this.getAuthHeaders()
    const url = 'check_waitlist_status'
    return new Promise((resolve,reject) => {
      ajax.post(url, {}, {
        headers
      })
      .then(res => resolve(res.data))
      .catch(err => reject(err))
    })
  }

  updatePhoto(photo) {
    const headers = this.getAuthHeaders()
    const data = new FormData()
    data.append('file', photo, 'image.jpg')
    const url = 'update_photo'

    return new Promise((resolve,reject) => {
      ajax.post(url, data , {
        headers
      })
      .then(res => resolve(res.data))
      .catch(err => reject(err))
    })
  }

  joinChannel(channel) {
    const headers = this.getAuthHeaders()
    const data = {
      channel,
    }
     const url = 'join_channel'

    return new Promise((resolve,reject) => {
      ajax.post(url, data , {
        headers
      })
      .then(res => resolve(res.data))
      .catch(err => reject(err))
    })
  }

  leaveChannel(channel) {
    const headers = this.getAuthHeaders()
    const data = {
      channel,
      channel_id: null
    }
     const url = 'leave_channel'

    return new Promise((resolve,reject) => {
      ajax.post(url, data , {
        headers
      })
      .then(res => resolve(res.data))
      .catch(err => reject(err))
    })
  }

  getProfile(userId) {
    const headers = this.getAuthHeaders()
    const data = {
      user_id: userId
    }
     const url = 'get_profile'

    return new Promise((resolve,reject) => {
      ajax.post(url, data , {
        headers
      })
      .then(res => resolve(res.data))
      .catch(err => reject(err))
    })
  }

  updateUsername(username) {
    const headers = this.getAuthHeaders()
    const data = {
      username
    }
    const url = 'update_username'

    return new Promise((resolve,reject) => {
      ajax.post(url, data , {
        headers
      })
      .then(res => resolve(res.data))
      .catch(err => reject(err))
    })
  }

  updateName(name) {
    const headers = this.getAuthHeaders()
    const data = {
      name
    }
    const url = 'update_name'

    return new Promise((resolve,reject) => {
      ajax.post(url, data , {
        headers
      })
      .then(res => resolve(res.data))
      .catch(err => reject(err))
    })
  }

  refreshToken(refreshToken)
  {
    const headers = this.getAuthHeaders()
    const data = {
      refresh: refreshToken
    }
    const url = 'refresh_token'

    return new Promise((resolve,reject) => {
      ajax.post(url, data , {
        headers
      })
      .then(res => resolve(res.data))
      .catch(err => reject(err))
    })
  }

  updateBio(bio){
    const headers = this.getAuthHeaders()
    const data = {
      bio: bio
    }
    const url = 'update_bio'

    return new Promise((resolve,reject) => {
      ajax.post(url, data , {
        headers
      })
      .then(res => resolve(res.data))
      .catch(err => reject(err))
    })
  }

}
