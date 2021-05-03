<template>
  <q-btn
    :icon="ionRefreshOutline"
    flat
    round
    @click="$emit('click')"
  />
</template>

<script>
import { ionRefreshOutline } from '@quasar/extras/ionicons-v5'

export default {
  name: 'RoomRefreshBtn',
  props: {
    busy: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      ionRefreshOutline,
    }
  },
}
</script>
