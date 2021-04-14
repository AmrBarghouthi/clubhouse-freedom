<template>
  <q-layout class="full-height">
    <q-page-container class="bg-alabaster">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'AuthLayout',
  data () {
    return {
      //
    }
  },
  mounted () {
    const authData = JSON.parse(localStorage.getItem('authData'))

    if (authData !== null) {
      this.$router.push({ name: 'index' })
    }
  },
}
</script>
