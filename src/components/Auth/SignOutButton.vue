<template>
  <div class="text-center fixed-bottom-left q-mb-xl q-ml-xl">
    <q-btn
      type="submit"
      label="Sign out"
      color="negative"
      rounded
      unelevated
      no-caps
      @click="signOut"
    />
  </div>
</template>

<script>
export default {
  name: 'AuthSignOutButton',
  methods: {
    signOut () {
      this.$store.commit('auth/RESET')
      this.$router.push({ name: 'auth.login' })
    },
  },
}
</script>
