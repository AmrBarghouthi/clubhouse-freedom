<template>
  <q-btn
    :icon="ionHandLeftOutline"
    flat
    round
    :disable="disable"
    :class="{ 'text-positive': handRaised, 'text-grey': disable }"
    @click="$emit(handRaised ? 'unraisehand' : 'raisehand')"
  />
</template>

<script>
import { ionHandLeftOutline } from '@quasar/extras/ionicons-v5'

export default {
  name: 'RoomHandRaiseUnraiseBtn',
  props: {
    handRaised: {
      type: Boolean,
      default: false,
    },
    disable: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      ionHandLeftOutline,
    }
  },
}
</script>
