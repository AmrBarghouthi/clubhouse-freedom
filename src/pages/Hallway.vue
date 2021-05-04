<template>
  <q-layout
    view="hHh lpR fFf"
    class="bg-alabaster"
  >
    <q-header class="bg-alabaster text-black">
      <HallwayTopToolbar
        class="q-mt-md q-mb-sm q-mx-md"
        @profilephotoclick="goToProfile"
      />
    </q-header>

    <q-page-container>
      <q-page class="bg-alabaster row items-center q-mx-md">
        <HallwayEventsList
          v-if="events.length"
          :events="events"
          :busy="state.isBusy"
          class="q-mx-md q-mb-md flex-1"
          @roomclicked="roomClickedHandler"
        />
        <HallwayRoomsList
          :rooms="rooms"
          :busy="state.isBusy"
          class="q-mx-md flex-1"
          @roomclicked="roomClickedHandler"
        />
        <q-page-sticky
          position="bottom"
          :offset="[18, 18]"
        >
          <HallwayStartRoomBtn />
        </q-page-sticky>
        <q-page-sticky
          position="bottom-left"
          :offset="[18, 18]"
        >
          <HallwayRefreshRoomsListBtn
            :busy="state.isBusy"
            @click="getRoomsAndEvents"
          />
        </q-page-sticky>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import HallwayEventsList from 'components/Hallway/HallwayEventsList'
import HallwayRefreshRoomsListBtn from 'components/Hallway/HallwayRefreshRoomsListBtn'
import HallwayRoomsList from 'components/Hallway/HallwayRoomsList'
import HallwayStartRoomBtn from 'components/Hallway/HallwayStartRoomBtn'
import HallwayTopToolbar from 'components/Hallway/HallwayTopToolbar'

export default {
  name: 'PageHallway',
  components: {
    HallwayEventsList,
    HallwayRefreshRoomsListBtn,
    HallwayRoomsList,
    HallwayStartRoomBtn,
    HallwayTopToolbar,
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.getRoomsAndEvents()
      vm.getMe()
    })
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
    getMe () {
      this.$clubhouseApi
        .getMe(true, true)
        .then(data => this.$store.commit('me/SET', data))
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
