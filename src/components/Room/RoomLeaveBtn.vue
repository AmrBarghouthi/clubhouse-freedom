<template>
  <q-btn
    rounded
    no-caps
    flat
    @click="$emit('click')"
  >
    <span class="btn-text text-red">
      ✌ Leave quietly
    </span>
  </q-btn>
</template>

<script>
export default {
  name: 'RoomLeaveBtn',
}
</script>

<style scoped>
.btn-text {
  white-space: nowrap;
}
</style>
