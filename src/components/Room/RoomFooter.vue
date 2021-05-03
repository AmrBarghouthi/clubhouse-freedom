<template>
  <q-footer class="fixed-bottom row justify-between bg-white text-black">
    <RoomLeaveBtn @click="$emit('leaveroom')" />
    <div class="row">
      <RoomRefreshBtn @click="$emit('refresh')" />
      <RoomPingFollowersBtn class="q-ml-md" />
      <RoomMuteBtn
        v-if="localUserIsSpeaker"
        :muted="muted"
        class="q-ml-md"
        @mute="$emit('mute')"
        @unmute="$emit('unmute')"
      />
      <RoomHandRaiseUnraiseBtn
        v-else
        :hand-raised="handRaised"
        :disable="!canRaiseHand"
        class="q-ml-md"
        @raisehand="$emit('raisehand')"
        @unraisehand="$emit('unraisehand')"
      />
    </div>
  </q-footer>
</template>

<script>
import RoomHandRaiseUnraiseBtn from 'components/Room/RoomHandRaiseUnraiseBtn'
import RoomLeaveBtn from 'components/Room/RoomLeaveBtn'
import RoomMuteBtn from 'components/Room/RoomMuteBtn'
import RoomPingFollowersBtn from 'components/Room/RoomPingFollowersBtn'
import RoomRefreshBtn from 'components/Room/RoomRefreshBtn'

export default {
  name: 'RoomFooter',
  components: {
    RoomHandRaiseUnraiseBtn,
    RoomLeaveBtn,
    RoomMuteBtn,
    RoomPingFollowersBtn,
    RoomRefreshBtn,
  },
  props: {
    localUserIsSpeaker: {
      type: Boolean,
      default: false,
    },
    muted: {
      type: Boolean,
      default: false,
    },
    handRaised: {
      type: Boolean,
      default: false,
    },
    canRaiseHand: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
