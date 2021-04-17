
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
          <q-btn
            padding="none"
            flat
            class="smooth-corners q-ml-sm"
          >
            <q-avatar
              size="md"
              square
              @click="goToProfile"
            >
              <img :src="profilePhotoUrl">
            </q-avatar>
          </q-btn>

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
  computed: {
    profilePhotoUrl () {
      return this.$store.getters['auth/profilePhotoUrl']
    },
  },
  methods: {
    goToProfile () {
      this.$router.push({ name: 'profile' })
    },
  },
}
</script>
