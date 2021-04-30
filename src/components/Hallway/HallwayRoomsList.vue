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
              <Avatar
                v-if="room.users.length > 1"
                :src="room.users[1].photo_url"
                :name="room.users[1].name"
                size="2.5rem"
                class="rooms-list-avatar-second"
              />
              <Avatar
                v-if="room.users.length > 0"
                :src="room.users[0].photo_url"
                :name="room.users[0].name"
                size="2.5rem"
              />
            </div>
            <div>
              <div
                v-for="user in room.users"
                :key="user.user_id"
              >
                <span>{{ user.name}}</span>
                <q-icon
                  v-if="user.is_speaker"
                  :name="ionChatbubbleEllipsesOutline"
                  class="q-ml-xs"
                />
              </div>
              <div class="q-mt-sm text-grey room-bottom">
                <q-icon
                  :name="ionPerson"
                  style="width: 0.8rem;"
                />
                <div class="q-ml-xs">{{ room.num_all }}</div>

                <div class="q-mx-sm">/</div>

                <q-icon
                  :name="ionChatbubbleEllipses"
                  style="width: 0.8rem;"
                />
                <div class="q-ml-xs">{{ room.num_speakers }}</div>
              </div>
            </div>
          </div>
        </q-item-section>
      </q-item>
    </div>
  </q-list>
</template>

<script>
import Avatar from 'components/Avatar'
import { ionChatbubbleEllipses, ionChatbubbleEllipsesOutline, ionPerson } from '@quasar/extras/ionicons-v5'

export default {
  name: 'HallwayRoomsList',
  components: {
    Avatar,
  },
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
  data () {
    return {
      ionChatbubbleEllipses,
      ionChatbubbleEllipsesOutline,
      ionPerson,
    }
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

.room-bottom {
  display: flex;
  align-items: center;
}

.no-rooms-text {
  color: gray;
  font-weight: 700;
  text-align: center;
}
</style>
