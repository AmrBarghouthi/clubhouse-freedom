<template>
  <div>
    <PageHeader @back="back">
      <template #right>
        <SettingsBtn></SettingsBtn>
      </template>
    </PageHeader>
    <div
      v-if="profile"
      class="q-mx-md"
    >
      <img
        :src="profile.photo_url"
        class="photo smooth-corners"
      >

      <div class="q-mt-sm text-weight-medium">{{ profile.name }}</div>
      <div class=" text-grey-9">@{{ profile.username }}</div>

      <div class="flex q-mt-sm">
        <div class="q-mr-md">
          <span class="text-h6 text-weight-medium">{{ profile.num_followers }}</span>
          <span>followers</span>
        </div>
        <div>
          <span class="text-h6 text-weight-medium">{{ profile.num_following }}</span>
          <span>following</span>
        </div>
      </div>

      <div class="q-my-md">
        {{profile.bio}}
      </div>

      <div class="social-media-container">
        <div
          v-if="profile.instagram"
          class="q-mr-lg"
        >
          twitter: {{ profile.instagram }}
        </div>
        <div
          v-if="profile.twitter"
          class="q-mr-lg"
        >
          instagram: {{ profile.twitter }}
        </div>
      </div>

      <div class="q-mt-lg nominated-by-container">
        <img :src="profile.invited_by_user_profile.photo_url" class="smooth-corners photo-sm q-mr-sm">
        <div>
          <div class="text-grey-7">Joined {{ moment(profile.time_created).format('MMM D, YYYY') }}</div>
          <div class="text-grey-7">Nominated by <span class="text-weight-medium text-black">{{ profile.invited_by_user_profile.name }}</span></div>
        </div>
      </div>

      <div
        v-if="profile.clubs.length"
        class="q-mt-lg text-weight-medium text-grey-9"
      >
        Member of
      </div>
      <div>
        <div
          v-for="club in profile.clubs"
          :key="club.club_id"
        >
          <img :src="club.photo_url" class="photo-sm q-mr-md">
        </div>
      </div>
    </div>

    <q-btn
      class="q-mt-xl q-mx-md"
      label="Sign out"
      color="negative"
      dense
      rounded
      no-caps
      @click="signOut"
    />
  </div>
</template>

<script>
import chAxios from 'src/ajax'
import moment from 'moment'

import PageHeader from 'components/PageHeader'
import SettingsBtn from 'components/ProfileIndex/SettingsBtn'

export default {
  name: 'ProfileIndexPage',
  components: {
    PageHeader,
    SettingsBtn,
  },
  data () {
    return {
      profile: null,
    }
  },
  created () {
    this.getProfile()
  },
  methods: {
    moment,
    async getProfile () {

      const data = {
        user_id: this.$store.getters['auth/userId'],
      }
      const headers = {
        Authorization: `Token ${this.$store.getters['auth/authToken']}`,
        'CH-UserID': this.$store.getters['auth/userId'],
      }

      this.profile = (await chAxios.post('get_profile', data, { headers })).data.user_profile
    },
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

<style scoped>
.photo {
  width: 5rem;
  height: 5rem;
}

.photo-sm {
  width: 2.7rem;
  height: 2.7rem;
}

.nominated-by-container {
  display: flex;
  align-items: center;
}

.social-media-container {
  display: flex;
  align-items: center;
}
</style>
