<template>
  <q-layout class="full-height">
    <q-page-container class="bg-alabaster">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'AuthLayout',
  data () {
    return {
      //
    }
  },
  computed: {
    ...mapGetters({
      signUpStage: 'auth/signUpStage',
    }),
  },
  watch: {
    signUpStage: {
      immediate: true,
      handler (newVal) {
        /* eslint-disable no-fallthrough */
        console.log(newVal)
        switch (newVal) {
          case 'COMPLETED':
            if (this.$router.currentRoute.name !== 'index' ) {
              this.$router.push({ name: 'index' })
            }
            break
          case 'WAITLISTED':
            if (this.$router.currentRoute.name !== 'auth.waitlisted') {
              this.$router.push({ name: 'auth.waitlisted' })
            }
            break
          case 'ONBOARDING':
            if (this.$router.currentRoute.name !== 'auth.onboarding') {
              this.$router.push({ name: 'auth.onboarding' })
            }
            break
          case 'NEW':
            if (this.$router.currentRoute.name !== 'auth.login') {
              this.$router.push({ name: 'auth.login' })
            }
            break
        }
      },
    },
  },
}
</script>
