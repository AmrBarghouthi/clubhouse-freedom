<template>
  <q-layout
    view="hHh lpR fFf"
    class="bg-alabaster"
  >
    <q-header class="bg-alabaster text-black q-mx-sm">
      <TopToolbar
        @profilephotoclick="goToProfile"
      />
    </q-header>

    <q-page-container>
      <q-page class="bg-alabaster center-it q-mx-md">
        <EventsList
          v-if="events.length"
          :events="events"
          :busy="state.isBusy"
          class="q-mx-md q-mb-md flex-1"
          @roomclicked="roomClickedHandler"
        />
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
            @click="getRoomsAndEvents"
          />
        </q-page-sticky>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import EventsList from 'components/Index/EventsList'
import RefreshRoomsListBtn from 'components/Index/RefreshRoomsListBtn'
import RoomsList from 'components/Index/RoomsList'
import StartRoomBtn from 'components/Index/StartRoomBtn'
import TopToolbar from 'components/Index/TopToolbar'

export default {
  name: 'PageIndex',
  components: {
    EventsList,
    RefreshRoomsListBtn,
    RoomsList,
    StartRoomBtn,
    TopToolbar,
  },
  data () {
    return {
      rooms: [],
      events: [],
      state: {
        isBusy: false,
      },
    }
  },
  created () {
    this.getRoomsAndEvents()
  },
  methods: {
    async getRoomsAndEvents () {
      this.state.isBusy = true
      this.$clubhouseApi
        .getChannels()
        .then(data => {
          this.rooms = data?.channels
          this.events = data?.events
        })
        .finally(() => {
          this.state.isBusy = false
        })
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
