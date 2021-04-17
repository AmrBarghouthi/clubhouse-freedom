<template>
  <q-page class="page">
    <div class="q-pa-md">
      <div
        dir="auto"
        class="topic"
      >
        {{ roomInfo.topic }}
      </div>
      <div class="users-grid">
        <div
          v-for="speaker in speakers"
          :key="speaker.user_id"
          class="text-center"
        >
          <q-avatar
            size="60px"
            square
            class="smooth-corners"
          >
            <img :src="speaker.photo_url">
          </q-avatar>
          <div class="q-mt-sm under-photo">
            <q-icon
              v-if="speaker.is_moderator"
              name="star"
              class="text-white bg-primary"
              style="border-radius: 100%"
            />
            <span
              style="margin-left: 3px;"
              :class="{'font-bold': isSpeakingNow(speaker.user_id)}"
            >
              {{ speaker.first_name }}
            </span>
          </div>
        </div>
      </div>
      <div class="subheading">
        Followed by the speakers
      </div>
      <div class="users-grid">
        <div
          v-for="user in followedBySpeakers"
          :key="user.user_id"
          class="text-center"
        >
          <q-avatar
            size="60px"
            square
            class="smooth-corners"
          >
            <img :src="user.photo_url">
          </q-avatar>
          <div class="q-mt-sm">
            <span>{{ user.first_name }}</span>
          </div>
        </div>
      </div>
      <div class="subheading">
        Others in the room
      </div>
      <div class="users-grid">
        <div
          v-for="user in others"
          :key="user.user_id"
          class="text-center"
        >
          <q-avatar
            size="60px"
            square
            class="smooth-corners"
          >
            <img :src="user.photo_url">
          </q-avatar>
          <div class="q-mt-sm">
            <span>{{ user.first_name }}</span>
          </div>
        </div>
      </div>
    </div>
    <q-footer class="bg-white text-black fixed-bottom q-pa-md footer">
      <q-btn
        label="Leave quietly"
        rounded
        no-caps
        icon="fas fa-hand-peace"
        flat
        class="bg-alabaster"
        @click="leaveRoom"
      />
      <div>
        <q-btn
          rounded
          no-caps
          icon="fas fa-plus"
          flat
          round
          class="bg-alabaster q-mr-md"
        />
        <q-btn
          rounded
          no-caps
          icon="fas fa-fist-raised"
          flat
          round
          class="bg-alabaster"
        />
      </div>
    </q-footer>
  </q-page>
</template>

<script>
import ajax from 'src/ajax'
import { mapGetters } from 'vuex'

export default {
  name: 'PageRoom',
  data () {
    return {
      roomInfo: {},
      speakingNowInfo: [],
    }
  },
  computed: {
    ...mapGetters('auth',{
      userId: 'userId',
      authToken: 'authToken',
    }),
    speakers () {
      return this.roomInfo.users.filter(user => user.is_speaker)
    },
    followedBySpeakers () {
      return this.roomInfo.users.filter(user => {
        return !user.is_speaker && user.is_followed_by_speaker
      })
    },
    others () {
      return this.roomInfo.users.filter(user => {
        return !user.is_speaker && !user.is_followed_by_speaker
      })
    },
  },
  created () {
    this.joinRoom()
  },
  methods: {
    joinRoom () {
      const roomCode = this.$route.params.roomCode
      const url = 'join_channel'
      const data = {
        channel: roomCode,
      }
      const headers = {
        'Authorization': `Token ${this.authToken}`,
        'CH-UserID': this.userId,
      }
      ajax.post(url, data, { headers })
        .then(res => {
          this.roomInfo = res.data
          this.listenToChat()
          console.log({res})
        })
        .catch(err => {
          console.log({err})
          this.$router.push({ name: 'index' })
        })
    },
    async listenToChat () {
      const token = this.roomInfo.token
      const channel = this.roomInfo.channel
      const info = ''
      const uid = this.userId

      this.$rtcEngine.enableAudioVolumeIndication(500, 1, false)

      const callback =  (speakers) => this.speakingNowInfo = speakers

      this.$rtcEngine.on('groupAudioVolumeIndication', callback)

      await this.$rtcEngine.joinChannel(token, channel, info, uid)

    },
    leaveRoom () {
      const roomCode = this.$route.params.roomCode
      const url = 'leave_channel'
      const data = {
        channel: roomCode,
        channel_id: null,
      }
      const headers = {
        'Authorization': `Token ${this.authToken}`,
        'CH-UserID': this.userId,
      }
      this.$rtcEngine.leaveChannel()
      ajax.post(url, data, { headers })
        .then(res => {
          console.log({res})
        })
        .catch(err => {
          console.log({err})
        })
        .finally(() => {
          this.$router.push({ name: 'index' })
        })
    },
    isSpeakingNow (userId) {
      return this.speakingNowInfo.find(user => user.uid === userId) !== undefined
    },
  },
}
</script>

<style scoped>
.page {
  background-color: white;
}

.topic {
  text-overflow: clip;
  overflow: hidden;
  white-space: nowrap;
  font-size: 2rem;
  margin-bottom: 2rem;
}

.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, 80px);
  justify-content: space-between;
  gap: 30px;
}

.under-photo {
  display: flex;
  align-items: center;
  justify-content: center;
}

.subheading {
  color: grey;
  font-weight: 700;
  margin-top: 3rem;
  margin-bottom: 1.5rem;
}

.footer {
  display: flex;
  justify-content: space-between;
}

.font-bold {
  font-weight: 700;
}
</style>
