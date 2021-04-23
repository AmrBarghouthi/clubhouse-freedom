<template>
  <div
    class="bio"
    @click="$emit('click')"
  >
    {{ bio }}
  </div>
</template>

<script>
export default {
  name: 'ProfileBio',
  props: {
    bio: {
      type: String,
      required: true,
    },
  },
}
</script>

<style scoped>
.bio {
  font-size: 0.825rem;
  white-space: pre-line;
}
</style>
