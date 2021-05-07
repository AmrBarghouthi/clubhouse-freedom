<template>
  <q-footer class="fixed-bottom row justify-between bg-white text-black">
    <RoomLeaveBtn @click="$emit('leaveroom')" />
    <div class="row q-gutter-x-sm">
      <RoomRefreshBtn @click="$emit('refresh')" />
      <RoomPingFollowersBtn />
      <RoomMuteBtn
        v-if="localUserIsSpeaker"
        :muted="muted"
        @mute="$emit('mute')"
        @unmute="$emit('unmute')"
      />
      <RoomHandRaiseUnraiseBtn
        v-else
        :hand-raised="handRaised"
        :disable="!canRaiseHand"
        @raisehand="$emit('raisehand')"
        @unraisehand="$emit('unraisehand')"
      />
    </div>
  </q-footer>
</template>

<script>
import RoomHandRaiseUnraiseBtn from './RoomHandRaiseUnraiseBtn'
import RoomLeaveBtn from './RoomLeaveBtn'
import RoomMuteBtn from './RoomMuteBtn'
import RoomPingFollowersBtn from './RoomPingFollowersBtn'
import RoomRefreshBtn from './RoomRefreshBtn'

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
