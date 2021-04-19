<template>
  <q-list>
    <div
      v-for="room in rooms"
      :key="room.channel_id"
    >
      <q-item
        v-ripple
        clickable
        class="q-my-sm bg-white rounded-base shadow-down-on-alabaster-1"
        @click="enterRoom(room.channel)"
      >
        <q-item-section>
          <q-item-label dir="auto">{{ room.topic }}</q-item-label>
          <div class="flex q-mt-sm q-gutter-md">
            <div class="rooms-list-avatars-container">
              <q-avatar
                v-if="room.users.length > 0"
                size="2.5rem"
                class="rooms-list-avatar-first smooth-corners"
                square
              >
                <img :src="room.users[0].photo_url">
              </q-avatar>
              <q-avatar
                v-if="room.users.length > 1"
                size="2.5rem"
                class="rooms-list-avatar-second smooth-corners"
                square
              >
                <img :src="room.users[1].photo_url">
              </q-avatar>
            </div>
            <div>
              <div
                v-for="user in room.users"
                :key="user.user_id"
              >
                <span>{{ user.name}}</span>
                <q-icon
                  v-if="user.is_speaker"
                  name="o_sms"
                  class="q-ml-xs"
                />
              </div>
              <div class="q-mt-sm text-grey">
                <q-icon name="person" />
                <span>{{room.num_all}}</span>
                <span class="q-mx-sm">/</span>
                <q-icon name="o_sms" />
                <span class="q-ml-xs">{{room.num_speakers}}</span>
              </div>
            </div>
          </div>
        </q-item-section>
      </q-item>
    </div>
  </q-list>
</template>

<script>
import _ from 'lodash'
import chAxios from 'src/ajax'

export default {
  data () {
    return {
      rooms: [],
    }
  },
  mounted () {
    this.getRooms()
  },
  methods: {
    async getRooms () {
      const headers = {
        Authorization: `Token ${this.$store.getters['auth/authToken']}`,
        'CH-UserID': this.$store.getters['auth/userId'],
      }

      const res = await chAxios.get('get_channels', { headers })

      if (_.has(res, 'data.channels')) this.rooms = res.data.channels

    },
    enterRoom (roomCode) {
      this.$router.push({ name: 'room', params: { roomCode: roomCode } })
    },
  },
}
</script>

<style>
.rooms-list-avatars-container {
  position: relative;
  width: 3.75rem;
  height: 3.75rem;
}

.rooms-list-avatar-first {
  z-index: 1;
}

.rooms-list-avatar-second {
  position: absolute;
  transform: translate(-50%, 50%);
}
</style>
