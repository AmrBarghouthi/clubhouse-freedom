<template>
  <q-page class="bg-white">
    <div class="q-pa-md">
      <RoomTopicLine :topic="roomInfo.topic" />
      <RoomSpeakersSection
        :speakers="usersCategorized.speakers"
        :muted-speakers-ids="mutedUsersIds"
        :speaking-speakers-ids="speakingSpeakersIds"
      />
      <RoomUsersSection
        v-if="usersCategorized.followedBySpeakers && usersCategorized.followedBySpeakers.length"
        section-title="Followed by speakers"
        :users="usersCategorized.followedBySpeakers"
        class="q-mt-xl"
      />
      <RoomUsersSection
        v-if="usersCategorized.others && usersCategorized.others.length"
        section-title="Others in the room"
        :users="usersCategorized.others"
        class="q-mt-xl"
      />
    </div>
    <RoomFooter
      :local-user-is-speaker="localUserIsSpeaker"
      :muted="mutedUsersIds.has(localUserId)"
      :hand-raised="handRaised"
      :can-raise-hand="roomInfo.is_handraise_enabled"
      class="q-pa-md"
      @refresh="refreshRoom"
      @leaveroom="leaveRoom"
      @mute="updateMute(true)"
      @unmute="updateMute(false)"
      @raisehand="updateHandRaised(true)"
      @unraisehand="updateHandRaised(false)"
    />
  </q-page>
</template>

<script>
import RoomFooter from 'components/Room/RoomFooter'
import RoomInvitedToSpeakDialog from 'components/Room/RoomInvitedToSpeakDialog'
import RoomSpeakersSection from 'components/Room/RoomSpeakersSection'
import RoomTopicLine from 'components/Room/RoomTopicLine'
import RoomUsersSection from 'components/Room/RoomUsersSection'

export default {
  name: 'PageRoom',
  components: {
    RoomFooter,
    RoomSpeakersSection,
    RoomTopicLine,
    RoomUsersSection,
  },
  data () {
    return {
      roomInfo: {},
      speakingSpeakersIds: new Set(),
      mutedUsersIds: new Set(),
      handRaised: false,
    }
  },
  computed: {
    localUserId () {
      return this.$store.getters['auth/userId']
    },
    usersCategorized () {
      return (this.roomInfo?.users ?? []).reduce((accumulator, current) => {
        if (current.is_speaker) {
          accumulator.speakers.push(current)
        } else if (current.is_followed_by_spseaker) {
          accumulator.followedBySpeakers.push(current)
        } else {
          accumulator.others.push(current)
        }
        return accumulator
      }, { speakers: [], followedBySpeakers: [], others: [] })
    },
    localUserIsSpeaker () {
      return this.usersCategorized?.speakers?.find(speaker => speaker.user_id === this.localUserId) !== undefined
    },
  },
  created () {
    this.$roomController
      .joinRoom(this.$route.params.roomCode)
      .then(data => {
        this.roomInfo = data
        this.$roomController.addListener('userJoined', this.onUserJoind)
        this.$roomController.addListener('userLeft', this.onUserLeft)
        this.$roomController.addListener('speakersVolumeUpdated', this.onSpeakerUpdate)
        this.$roomController.addListener('userMuteChanged', this.onUserMuteUpdated)
        this.$roomController.addListener('invetedToSpeak', this.onInvitedToSpeak)
        this.$roomController.addListener('roomUpdated', this.onRoomUpdated)
        this.$roomController.addListener('speakerAdded', this.onSpeakerAdded)
        this.$roomController.addListener('speakerRemoved', this.onSpeakerRemoved)
      })
      .catch(() => {
        this.showFailedToJoinNotification()
        this.leaveRoom()
      })
  },
  methods: {
    onUserJoind (profile) {
      const index = this.roomInfo?.users?.findIndex(user => user.user_id === profile.user_id) ?? -1
      if (index === -1) {
        this.roomInfo.users.push(profile)
      }
    },
    onUserLeft (userId) {
      const index = this.roomInfo?.users?.findIndex(user => user.user_id === userId) ?? -1
      if (index !== -1) {
        this.roomInfo.users.splice(index, 1)
      }
    },
    onSpeakerUpdate (speakers) {
      let ids = this.speakingSpeakersIds
      const localUser = speakers.find(speaker => speaker.uid === 0)

      if (localUser) {
        localUser.volume > 0
          ? ids.add(this.localUserId)
          : ids.delete(this.localUserId)
      } else {
        ids = new Set(ids.has(this.localUserId) ? [this.localUserId] : [])
        speakers.forEach(speaker => ids.add(speaker.uid))
      }

      this.speakingSpeakersIds = ids
    },
    onUserMuteUpdated (userId, muted) {
      muted
        ? this.mutedUsersIds.add(userId)
        : this.mutedUsersIds.delete(userId)
    },
    onInvitedToSpeak (inviterName, inviterId) {
      this.$q
        .dialog({ component: RoomInvitedToSpeakDialog, inviterName })
        .onOk(() => this.$roomController.acceptSpeakerInvite(inviterId))
        .onCancel(() => this.$roomController.rejectSpeakerInvite(inviterId))
    },
    onRoomUpdated (roomInfo) {
      this.roomInfo = roomInfo
    },
    onSpeakerAdded (profile) {
      const index =  this.roomInfo?.users?.findIndex(user => user.user_id == profile.user_id)
      if (index != -1) {
        this.roomInfo.users[index] = profile
      } else {
        this.roomInfo.users.push(profile)
      }
    },
    onSpeakerRemoved (userId) {
      const index =  this.roomInfo?.users?.findIndex(user => user.user_id == userId) ?? -1
      if (index !== -1) {
        this.roomInfo.users[index].is_speaker = false
      }
    },
    updateHandRaised (handRaised) {
      this.$roomController.setHandRaised(handRaised)
      this.handRaised = handRaised
    },
    leaveRoom () {
      this.$roomController.leaveRoom()
      this.$router.push({ name: 'hallway' })
    },
    showFailedToJoinNotification () {
      this.$q.notify({
        type: 'negative',
        message: 'An error occured while joing the room.',
        position: 'top',
        timeout: 2500,
      })
    },
    updateMute (mute) {
      this.$roomController.setMute(mute)
    },
    refreshRoom () {
      this.$roomController.updateRoom()
    },
  },
}
</script>
