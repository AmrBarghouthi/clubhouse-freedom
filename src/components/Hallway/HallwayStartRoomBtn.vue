<template>
  <q-btn
    icon="add"
    color="primary"
    rounded
    no-caps
    @click="$emit('click')"
  >
    Start a room
  </q-btn>
</template>

<script>
export default {
  name: 'HallwayStartRoomBtn',
}
</script>
