<template>
  <div class="flex">
    <div
      class="q-mr-md cursor-pointer"
      @click="$emit('followersClick')"
    >
      <span class="count text-weight-medium">{{ followersCount }}</span>
      <span class="q-ml-xs">followers</span>
    </div>
    <div
      class="cursor-pointer"
      @click="$emit('followingClick')"
    >
      <span class="count text-weight-medium">{{ followingCount }}</span>
      <span class="q-ml-xs">following</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProfileFollowingAndFollowers',
  props: {
    followersCount: {
      type: Number,
      default: 0,
    },
    followingCount: {
      type: Number,
      default: 0,
    },
  },
}
</script>

<style scoped>
.count {
  font-size: 1.1rem;
}
</style>
