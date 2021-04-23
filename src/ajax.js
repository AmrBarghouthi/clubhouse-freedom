import Axios from 'axios'
import _ from 'lodash'
import { Notify } from 'quasar'
import router from 'src/router'
import { machineIdSync } from 'node-machine-id'

const ajax = Axios.create({
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

const showNetworkErrorNotification =  () => {
  Notify.create({
    message: 'Network error',
    color: 'negative',
    position: 'top',
    timeout: 2500,
  })
}
const showNetworkErrorNotificationThrottled = _.throttle(showNetworkErrorNotification, 5000)

ajax.interceptors.response.use(response => {
  return response
}, error => {
  if (_.get(error, 'message') === 'Network Error') {
    showNetworkErrorNotificationThrottled()
  }

  if (_.get(error, 'response.status') === 401) {
    router.push({ name: 'auth.login' })
  }

  return Promise.reject(error)
})

export default ajax
