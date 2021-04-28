import RoomController from 'src/RoomController'
import ClubhouseApi from 'src/ClubhouseApi'
import { Notify } from 'quasar'

export default ({ Vue, router, store }) => {
  const userIdResolver = () => store.getters['auth/userId']
  const chAuthTokenResolver = () => store.getters['auth/authToken']

  const credentials = () => ({
    userId: userIdResolver(),
    authToken: chAuthTokenResolver(),
  })

  const onUnauthorizedError = () => {
    Notify.create({
      message: 'You are no longer signed in on this device.',
      color: 'negative',
      position: 'top',
      timeout: 2500,
    })
    router.push({ name: 'auth.login' })
  }

  const onNetworkError = () => {
    Notify.create({
      message: 'Network error',
      color: 'negative',
      position: 'top',
      timeout: 2500,
    })
  }

  const clubhouseApi = new ClubhouseApi({ credentials, onUnauthorizedError, onNetworkError })
  const roomController = new RoomController(userIdResolver, clubhouseApi)
  Vue.prototype.$clubhouseApi = clubhouseApi
  Vue.prototype.$roomController = roomController
}
