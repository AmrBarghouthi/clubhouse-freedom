
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
            class="q-ml-sm bg-primary smooth-corners"
            size="md"
            square
          >
            <img :src="profilePhotoUrl">
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
import { mapGetters } from 'vuex'

export default {
  name: 'MainLayout',
  data () {
    return {
      authData: null,
    }
  },
  computed: {
    ...mapGetters({
      signUpStage: 'auth/signUpStage',
      profilePhotoUrl: 'auth/profilePhotoUrl',
    }),
  },
  watch: {
    signUpStage: {
      immediate: true,
      handler (newVal) {
        if (newVal !== 'COMPLETED') {
          this.$router.push({ name: 'auth.login' })
        }
      },
    },
  },
}
</script>
