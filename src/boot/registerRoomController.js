import RoomController from 'src/RoomController'

export default ({ Vue, store }) =>
{
  const userIdResolver = () => store.getters['auth/userId']
  const chAuthTokenResolver = () => store.getters['auth/authToken']
  const roomController = new RoomController(userIdResolver,chAuthTokenResolver)
  Vue.prototype.$roomController = roomController
}
