
<template>
  <q-layout
    view="hHh lpR fFf"
    class="bg-alabaster"
  >

    <q-header class="bg-alabaster text-black">
      <q-toolbar>
        <q-btn
          flat
          round
          icon="search"
          size="md"
        />
        <q-space />
        <div>
          <q-btn
            flat
            round
            icon="o_date_range"
            size="md"
            outline
          />
          <q-btn
            flat
            round
            icon="o_notifications"
            size="md"
            outline
          />
          <q-avatar
            class="q-ml-sm"
            size="md"
          >
            <img :src="authData.user_profile.photo_url">
          </q-avatar>
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>
export default {
  name: 'MainLayout',
  data () {
    return {
      authData: null,
    }
  },
  created () {
    this.authData = JSON.parse(localStorage.getItem('authData'))

    if (this.authData === null) {
      this.$router.push({ name: 'auth.login' })
    }
  },
}
</script>
