<template>
  <q-btn
    :icon="ionAddOutline"
    flat
    round
    style="font-size: 1.2rem"
    padding="xs"
  />
</template>

<script>
import { ionAddOutline } from '@quasar/extras/ionicons-v5'

export default {
  name: 'RoomPingFollowersBtn',
  data () {
    return {
      ionAddOutline,
    }
  },
}
</script>

