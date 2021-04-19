<template>
  <q-page class="bg-alabaster center-it">
    <RoomsList
      :rooms="rooms"
      :busy="state.isBusy"
      class="q-mx-md flex-1"
      @roomclicked="roomClickedHandler"
    />
    <q-page-sticky
      position="bottom"
      :offset="[18, 18]"
    >
      <q-btn
        icon="add"
        color="primary"
        rounded
        no-caps
      >
        Start a room
      </q-btn>
    </q-page-sticky>
  </q-page>
</template>

<script>
import _ from 'lodash'
import chAxios from 'src/ajax'
import RoomsList from 'components/Index/RoomsList'

export default {
  name: 'PageIndex',
  components: {
    RoomsList,
  },
  data () {
    return {
      rooms: [],
      state: {
        isBusy: false,
      },
    }
  },
  created () {
    this.getRooms()
  },
  methods: {
    async getRooms () {
      const headers = {
        Authorization: `Token ${this.$store.getters['auth/authToken']}`,
        'CH-UserID': this.$store.getters['auth/userId'],
      }

      this.state.isBusy = true
      const res = await chAxios.get('get_channels', { headers })
      this.state.isBusy = false

      if (_.has(res, 'data.channels')) this.rooms = res.data.channels

    },
    enterRoom (roomCode) {
      this.$router.push({ name: 'room', params: { roomCode: roomCode } })
    },
    roomClickedHandler (event) {
      this.enterRoom(event.roomCode)
    },
  },
}
</script>

<style>
.center-it {
  display: grid;
  place-items: center;
}
</style>
