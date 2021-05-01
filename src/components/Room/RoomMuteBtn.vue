<template>
  <q-btn
    :icon="muted ? ionMicOff : ionMic"
    flat
    round
    @click="$emit(muted ? 'unmute' : 'mute')"
  />
</template>

<script>
import { ionMic, ionMicOff } from '@quasar/extras/ionicons-v5'

export default {
  name: 'RoomMuteBtn',
  props: {
    muted: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      ionMic,
      ionMicOff,
    }
  },
}
</script>
