<template>
  <q-btn
    icon="refresh"
    round
    color="accent"
    :loading="busy"
    dense
    @click="$emit('click')"
  />
</template>

<script>
export default {
  name: 'HallwayRefreshRoomsListBtn',
  props: {
    busy: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
