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
            :muted="isMuted(speaker.user_id)"
          />
          <div class="q-mt-sm under-photo">
            <SpeakerAsterisk
              v-if="speaker.is_moderator"
              style="width: 1rem; height: 1rem;"
            />
            <span style="margin-left: 3px;">
              <span>{{ speaker.first_name }}</span>
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
        <span v-if="userIsNotASpeaker">
          <q-btn
            v-if="!handRasid"
            rounded
            no-caps
            icon="o_pan_tool"
            flat
            round
            class="bg-alabaster"
            :disable="!roomInfo.is_handraise_enabled"
            @click="raiseHand"
          />
          <q-btn
            v-else
            rounded
            no-caps
            icon="pan_tool"
            flat
            round
            class="bg-alabaster"
            @click="unraiseHand"
          />
        </span>
        <span v-else>
          <q-btn
            v-if="isMuted(userId)"
            rounded
            no-caps
            icon="fas fa-microphone-slash"
            flat
            round
            class="bg-alabaster"
            @click="unmute"
          />
          <q-btn
            v-else
            rounded
            no-caps
            icon="fas fa-microphone"
            flat
            round
            class="bg-alabaster"
            @click="mute"
          />
        </span>
      </div>
    </q-footer>
    <q-dialog
      v-model="showInviteDialog"
      persistent
    >
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm">{{ invite.userName }} invted you to speak</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            v-close-popup
            flat
            label="Cancel"
            color="primary"
          />
          <q-btn
            v-close-popup
            flat
            label="Accept"
            color="primary"
            @click="acceptSpeakerInvite"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import _ from 'lodash'
import Avatar from 'components/Avatar'
import SpeakerAsterisk from 'components/Room/SpeakerAsterisk'

export default {
  name: 'PageRoom',
  components: {
    Avatar,
    SpeakerAsterisk,
  },
  data () {
    return {
      roomInfo: {},
      speakingNowInfo: [],
      localUserSpeaking: false,
      mutedUsers: new Set(),
      handRasid: false,
      showInviteDialog: false,
      invite: {
        userName: null,
        userId: null,
      },
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

        if (isSpeaker) {
          return 'speakers'
        }

        if (isFollowedBySpeakers) {
          return 'followedBySpeakers'
        }

        return 'others'
      })
    },
    userIsNotASpeaker () {
      if (this.usersCategorized.speakers) {
        return this.usersCategorized.speakers.find(speaker => speaker.user_id === this.userId) === undefined
      } else {
        return false
      }
    },
  },
  created () {
    this.$roomController
      .joinRoom(this.$route.params.roomCode)
      .then(data => {
        this.roomInfo = data
        this.$roomController.addListener('userJoined', this.userJoindEvent)
        this.$roomController.addListener('userLeft', this.userLeftEvent)
        this.$roomController.addListener('speakersVolumeUpdated', this.speakerUpdateEvent)
        this.$roomController.addListener('userMuteChanged', this.userMuteUpdatedEvent)
        this.$roomController.addListener('invetedToSpeak', this.invitedToSpeakEvent)
        this.$roomController.addListener('roomUpdated', this.updateRoomInfo)
        this.$roomController.addListener('speakerAdded', this.addSpeaker)
        this.$roomController.addListener('speakerRemoved', this.removeSpeaker)
      })
      .catch(() => {
        this.showFailedToJoinNotification()
        this.leaveRoom()
      })
  },
  beforeDestroy () {},
  methods: {
    raiseHand () {
      this.$roomController.raiseHand()
      this.handRasid = true
    },
    unraiseHand () {
      this.$roomController.unraiseHand()
      this.handRasid = false
    },
    leaveRoom () {
      this.$roomController.leaveRoom()
      this.$router.push({ name: 'index' })
    },
    invitedToSpeakEvent (userName, userId) {
      this.invite = {
        userName,
        userId,
      }
      this.showInviteDialog = true
    },
    userJoindEvent (profile) {
      let notInRoom = true
      for (let i = 0; i < this.roomInfo.users.length; i++) {
        const user = this.roomInfo.users[i]
        if (user.user_id == profile.user_id) {
          notInRoom = false
        }
      }
      if (notInRoom) {
        this.roomInfo.users.push(profile)
      }
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
      const localUser = _.find(speakers, speaker => speaker.uid === 0)
      if (localUser !== undefined) {
        this.localUserSpeaking = localUser.volume != 0
      } else {
        this.speakingNowInfo = speakers
      }
    },
    userMuteUpdatedEvent (userId, muted) {
      if (muted) {
        this.mutedUsers.add(userId)
      } else {
        this.mutedUsers.delete(userId)
      }
    },
    updateRoomInfo (roomInfo) {
      this.roomInfo = roomInfo
    },
    addSpeaker (profile) {
      const index =  _.findIndex(this.roomInfo.users, user => user.user_id == profile.user_id)
      if (index != -1) {
        this.roomInfo.users[index] = profile
      } else {
        this.roomInfo.users.push(profile)
      }
    },
    removeSpeaker (userId) {
      const index =  _.findIndex(this.roomInfo.users, user => user.user_id == userId)
      if (index != -1) {
        this.roomInfo.users[index].is_speaker = false
      }
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
        userId == this.userId ? (this.localUserSpeaking && !this.isMuted(userId)) : this.speakingNowInfo.find(user => user.uid === userId) !== undefined
      )
    },
    isMuted (userId) {
      return this.mutedUsers.has(userId)
    },
    acceptSpeakerInvite () {
      this.$roomController.acceptSpeakerInvite(this.invite.userId)
    },
    mute () {
      this.$roomController.setMute(true)
    },
    unmute () {
      this.$roomController.setMute(false)
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
