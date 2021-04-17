<template>
  <div>
    <div>
      Profile Page
    </div>
    <q-btn
      class=""
      color="primary"
      label="Back"
      icon="arrow_back"
      @click="back"
    />
    <q-btn
      class=""
      color="primary"
      label="Sign out"
      @click="signOut"
    />
  </div>
</template>

<script>
export default {
  name: 'ProfileIndexPage',
  methods: {
    back () {
      this.$router.back()
    },
    signOut () {
      this.$store.commit('auth/RESET')
      this.$router.push({ name: 'auth.login' })
    },
  },
}
</script>
