<template>
  <div dir="auto">
    <div class="topic">
      {{ topic }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'RoomTopicLine',
  props: {
    topic: {
      type: String,
      default: '',
    },
  },
}
</script>

<style scoped>
.topic {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
}
</style>
