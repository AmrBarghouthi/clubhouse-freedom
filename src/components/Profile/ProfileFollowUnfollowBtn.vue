<template>
  <q-btn
    class="btn-think-borders"
    color="secondary"
    no-caps
    :outline="!value"
    padding="none"
    rounded
    unelevated
    @click="$emit('input')"
  >
    <div class="follow-btn-text">
      {{ value ? 'Following' : 'Follow' }}
    </div>
  </q-btn>
</template>

<script>
export default {
  name: 'ProfileFollowUnfollowBtn',
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style >
.follow-btn-text {
  font-size: 0.75rem;
  padding: 0.1rem 1rem;
}
</style>
