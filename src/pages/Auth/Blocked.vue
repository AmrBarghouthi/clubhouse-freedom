<template>
  <div class="q-mx-auto q-px-xl centered">
    <div class="blocked-text">
      This account is blocked.
    </div>
    <div class="text-center fixed-bottom q-mb-xl">
      <q-btn
        label="Back to Sign in"
        color="secondary"
        no-caps
        unelevated
        rounded
        :to="{ name: 'auth.login' }"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'AuthBlockedPage',
  components: {
  },
}
</script>

<style>
.centered {
  display: grid;
  place-items: center;
  height: 100vh;
}

.blocked-text {
  color: gray;
  font-weight: 700;
}
</style>
