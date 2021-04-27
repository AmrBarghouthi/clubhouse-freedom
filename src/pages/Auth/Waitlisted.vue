<template>
  <div class="waitlisted-fh waitlisted-center-it q-mx-lg">
    <div/>
    <div>
      <div
        class="text-center"
        style="font-size: 1.1rem"
      >
        🎉 We've reserved <span class="waitlisted-username">@{{$store.getters['auth/username']}}</span> for you,
        and we'll text you as soon as your account is ready!
      </div>
      <div
        class="text-center q-mt-lg"
        style="font-size: 0.8rem"
      >
        To learn more about Clubhouse you can visit
        <span
          class="waitlisted-nowrap text-weight-medium cursor-pointer"
          @click="onBlogClick"
        >
          our blog.
        </span>
        Thank you! 🙏
      </div>

      <div
        class="text-center q-mt-xl text-secondary"
        style="font-size: 0.8rem"
      >
        Got your invite text?
        <span
          class="text-weight-bold waitlisted-nowrap cursor-pointer"
          @click="onSignInClick"
        >
          Sign in ➝
        </span>
      </div>

    </div>
  </div>
</template>

<script>
import { openURL } from 'quasar'

export default {
  name: 'AuthWaitlistedPage',
  methods: {
    onBlogClick () {
      openURL('https://www.joinclubhouse.com/blog')
    },
    onSignInClick () {
      this.$router.push({ name: 'auth.login' })
    },
  },
}
</script>

<style scoped>
.waitlisted-fh {
  height: 100vh;
}

.waitlisted-center-it {
  display: grid;
  grid-template-rows: 1fr 2fr;
}

.waitlisted-username {
  font-weight: 600;
  white-space: nowrap;
}

.waitlisted-nowrap {
  white-space: nowrap;
}
</style>
