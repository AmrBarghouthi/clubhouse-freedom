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
          v-for="speaker in usersCategorized.speakers"
          :key="speaker.user_id"
          class="text-center"
        >
          <Avatar
            size="70px"
            :src="speaker.photo_url"
            :name="speaker.name"
            glows
            :glowing="isSpeakingNow(speaker.user_id)"
          />
          <div class="q-mt-sm under-photo">
            <q-icon
              v-if="speaker.is_moderator"
              name="star"
              class="text-white bg-primary"
              style="border-radius: 100%"
            />
            <span
              style="margin-left: 3px;"
              :class="{ 'font-bold': isSpeakingNow(speaker.user_id) }"
            >
              {{ speaker.first_name }}  <q-icon
                v-if="isMuted(speaker.user_id)"
                name="fas fa-microphone-slash"
              />
            </span>
          </div>
        </div>
      </div>
      <div class="subheading">
        Followed by the speakers
      </div>
      <div class="users-grid">
        <div
          v-for="user in usersCategorized.followedBySpeakers"
          :key="user.user_id"
          class="text-center"
        >
          <Avatar
            size="70px"
            :src="user.photo_url"
            :name="user.name"
            glows
          />
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
          v-for="user in usersCategorized.others"
          :key="user.user_id"
          class="text-center"
        >
          <Avatar
            size="70px"
            :src="user.photo_url"
            :name="user.name"
            glows
          />
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
import _ from 'lodash'
import Avatar from 'components/Avatar'

export default {
  name: 'PageRoom',
  components: {
    Avatar,
  },
  data () {
    return {
      roomInfo: {},
      speakingNowInfo: [],
      mutedUsers: new Set(),
    }
  },
  computed: {
    userId () {
      return this.$store.getters['auth/userId']
    },
    authToken () {
      return this.$store.getters['auth/authToken']
    },
    usersCategorized () {
      return _.groupBy(this.roomInfo.users || [], user => {
        const isSpeaker = user.is_speaker
        const isFollowedBySpeakers = user.is_followed_by_speaker && !isSpeaker

        if (isSpeaker) return 'speakers'
        if (isFollowedBySpeakers) return 'followedBySpeakers'
        return 'others'
      })
    },
  },
  async created () {
    const room = this.$route.params.roomCode
    try {
      this.roomInfo = await this.$roomController.joinRoom(room)
    } catch (error) {
      this.showFailedToJoinNotification()
      this.leaveRoom()
    }
    this.$roomController.addListener('userJoined', this.userJoindEvent)
    this.$roomController.addListener('userLeft', this.userLeftEvent)
    this.$roomController.addListener('speakersVolumeUpdadetd',this.speakerUpdateEvent)
    this.$roomController.addListener('userMuteChanged',this.userMuteUpdatedEvent)
  },
  beforeDestroy () {},
  methods: {
    leaveRoom () {
      this.$roomController.leaveRoom()
      this.$router.push({ name: 'index' })
    },
    userJoindEvent (profile) {
      let notInRoom = true
      for (let i = 0; i < this.roomInfo.users.length; i++) {
        const user = this.roomInfo.users[i]
        if (user.user_id == profile.user_id) {
          notInRoom = false
        }
      }
      if (notInRoom) this.roomInfo.users.push(profile)
    },
    userLeftEvent (userId) {
      for (let i = 0; i < this.roomInfo.users.length; i++) {
        const user = this.roomInfo.users[i]
        if (user.user_id == userId) {
          this.roomInfo.users.splice(i, 1)
          break
        }
      }
    },
    speakerUpdateEvent (speakers) {
      if (_.find(speakers, speaker => speaker.uid === 0)) return
      this.speakingNowInfo = speakers
    },
    userMuteUpdatedEvent (userId, muted){
      if (muted)
        this.mutedUsers.add(userId)
      else
        this.mutedUsers.delete(userId)
    },
    showFailedToJoinNotification () {
      this.$q.notify({
        type: 'negative',
        message: 'An error occured while joing the room.',
        position: 'top',
        timeout: 2500,
      })
    },
    isSpeakingNow (userId) {
      return (
        this.speakingNowInfo.find(user => user.uid === userId) !== undefined
      )
    },
    isMuted (userId) {
      return this.mutedUsers.has(userId)
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
</style>
