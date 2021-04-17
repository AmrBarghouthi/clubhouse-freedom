<template>
  <div class="text-center fixed-bottom-right q-mb-xl q-mr-xl">
    <q-btn
      type="submit"
      label="Skip"
      color="negative"
      rounded
      unelevated
      no-caps
      @click="skipWaitlist"
    />
  </div>
</template>

<script>
export default {
  name: 'SkipWaitlistButton',
  methods: {
    skipWaitlist () {
      this.$store.commit('auth/MARK_AS_INVITED')
      this.$router.push({ name: 'index' })
    },
  },
}
</script>
