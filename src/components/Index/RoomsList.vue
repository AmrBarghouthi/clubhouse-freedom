<template>
  <div
    v-if="rooms.length === 0 && !busy"
    class="no-rooms-text"
  >
    <div>No rooms for you.</div>
    <div>Something is wrong in the spacetime continuum!</div>
  </div>
  <q-list
    v-else
    class="full-width"
  >
    <div
      v-for="room in rooms"
      :key="room.channel_id"
    >
      <q-item
        v-ripple
        clickable
        class="q-my-sm bg-white rounded-base shadow-down-on-alabaster-1"
        @click="$emit('roomclicked', { roomCode: room.channel })"
      >
        <q-item-section>
          <q-item-label dir="auto">{{ room.topic }}</q-item-label>
          <div class="flex q-mt-sm q-gutter-md">
            <div class="rooms-list-avatars-container">
              <q-avatar
                v-if="room.users.length > 1"
                size="2.5rem"
                class="rooms-list-avatar-second smooth-corners"
                square
              >
                <img :src="room.users[1].photo_url">
              </q-avatar>
              <q-avatar
                v-if="room.users.length > 0"
                size="2.5rem"
                class="rooms-list-avatar-first smooth-corners"
                square
              >
                <img :src="room.users[0].photo_url">
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
export default {
  name: 'IndexRoomsList',
  props: {
    rooms: {
      type: Array,
      required: true,
    },
    busy: {
      type: Boolean,
      default: false,
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

.rooms-list-avatar-second {
  position: absolute;
  transform: translate(50%, 50%);
}

.no-rooms-text {
  color: gray;
  font-weight: 700;
  text-align: center;
}
</style>
