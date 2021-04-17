<template>
  <div class="text-center fixed-bottom-right q-mb-xl q-mr-xl">
    <q-btn
      type="submit"
      label="Skip"
      color="negative"
      rounded
      unelevated
      no-caps
      @click="skipOnboarding"
    />
  </div>
</template>

<script>
export default {
  name: 'SkipOnboardingButton',
  methods: {
    skipOnboarding () {
      this.$store.commit('auth/MARK_AS_ONBOARD')
      this.$router.push({ name: 'index' })
    },
  },
}
</script>
