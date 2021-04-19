<template>
  <q-layout
    view="hHh lpR fFf"
    class="bg-alabaster"
  >
    <q-header class="bg-alabaster text-black">
      <q-toolbar>
        <q-btn
          flat
          round
          icon="search"
          size="md"
        />
        <q-space />
        <div>
          <q-btn
            flat
            round
            icon="o_date_range"
            size="md"
            outline
          />
          <q-btn
            flat
            round
            icon="o_notifications"
            size="md"
            outline
          />
          <q-btn
            padding="none"
            flat
            class="smooth-corners q-ml-sm"
          >
            <q-avatar
              size="md"
              square
              @click="goToProfile"
            >
              <img :src="$store.getters['auth/profilePhotoUrl']">
            </q-avatar>
          </q-btn>

        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
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
          <StartRoomBtn />
        </q-page-sticky>
        <q-page-sticky
          position="bottom-left"
          :offset="[18, 18]"
        >
          <RefreshRoomsListBtn
            :busy="state.isBusy"
            @click="getRooms"
          />
        </q-page-sticky>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import _ from 'lodash'
import chAxios from 'src/ajax'

import RefreshRoomsListBtn from 'components/Index/RefreshRoomsListBtn'
import RoomsList from 'components/Index/RoomsList'
import StartRoomBtn from 'components/Index/StartRoomBtn'

export default {
  name: 'PageIndex',
  components: {
    RefreshRoomsListBtn,
    RoomsList,
    StartRoomBtn,
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
    goToProfile () {
      this.$router.push({ name: 'profile' })
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
