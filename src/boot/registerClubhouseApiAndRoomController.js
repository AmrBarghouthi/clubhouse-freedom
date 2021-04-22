import RoomController from 'src/RoomController'
import ClubhouseApi from 'src/ClubhouseApi'

export default ({ Vue, store }) =>
{
  const userIdResolver = () => store.getters['auth/userId']
  const chAuthTokenResolver = () => store.getters['auth/authToken']
  const clubhouseApi = new ClubhouseApi(()=> {
    return {
      userId: userIdResolver(),
      authToken: chAuthTokenResolver(),
    }
  })
  const roomController = new RoomController(userIdResolver,clubhouseApi)
  Vue.prototype.$clubhouseApi = clubhouseApi
  Vue.prototype.$roomController = roomController
}
