<template>
  <div class="window-height">

    <q-tab-panels
      v-model="tab"
      animated
      vertical
      class="bg-alabaster full-height"
    >

      <q-tab-panel
        name="profile"
        class="q-pa-none full-height"
      >
        <PageHeader
          back-btn
          @back="back"
        >
          <template #right>
            <SettingsBtn @click="tab = 'settings'" />
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
            <div class="q-mr-md cursor-pointer">
              <span class="text-h6 text-weight-medium">{{ profile.num_followers }}</span>
              <span class="q-ml-xs">followers</span>
            </div>
            <div class="cursor-pointer">
              <span class="text-h6 text-weight-medium">{{ profile.num_following }}</span>
              <span class="q-ml-xs">following</span>
            </div>
          </div>

          <div
            v-if="profile.bio"
            class="q-mt-md bio"
          >
            {{ profile.bio }}
          </div>

          <div class="social-media-container q-mt-md">
            <div
              v-if="profile.twitter"
              class="q-mr-lg cursor-pointer"
              @click="openLinkInBrowser(`https://twitter.com/${profile.twitter}`)"
            >
              <q-icon
                name="fab fa-twitter"
                style="color: #00acee;"
              />
              <span class="text-weight-medium q-ml-xs">{{ profile.twitter }}</span>
            </div>
            <div
              v-if="profile.instagram"
              class="q-mr-lg cursor-pointer"
              @click="openLinkInBrowser(`https://instagram.com/${profile.instagram}/`)"
            >
              <q-icon
                name="fab fa-instagram"
                style="color: #e95950;"
              />
              <span class="text-weight-medium q-ml-xs">{{ profile.instagram }}</span>
            </div>
          </div>

          <div class="q-mt-xl nominated-by-container">
            <img
              v-if="profile.invited_by_user_profile"
              :src="profile.invited_by_user_profile.photo_url"
              class="smooth-corners photo-sm q-mr-sm"
            >
            <div>
              <div class="text-grey-7">Joined {{ moment(profile.time_created).format('MMM D, YYYY') }}</div>
              <div
                v-if="profile.invited_by_user_profile"
                class="text-grey-7"
              >
                <span>Nominated by</span>
                <span
                  class="text-weight-medium text-black cursor-pointer"
                  @click="goToProfile(profile.invited_by_user_profile.user_id)"
                >
                  {{ profile.invited_by_user_profile.name }}
                </span>
              </div>
            </div>
          </div>

          <div
            v-if="profile.clubs.length"
            class="q-mt-lg text-weight-medium text-grey-9"
          >
            Member of
          </div>
          <div class="q-mt-sm flex">
            <div
              v-for="club in profile.clubs"
              :key="club.club_id"
            >
              <img
                :src="club.photo_url"
                class="photo-xs q-mr-sm smooth-corners"
              >
            </div>
          </div>
        </div>
      </q-tab-panel>

      <q-tab-panel
        name="settings"
        class="full-height"
      >
        <PageHeader
          exit-btn
          @exit="tab = 'profile'"
        >
          SETTINGS
        </PageHeader>

        <q-btn
          class="q-mt-xl q-mx-md full-width text-red"
          label="Log out"
          color="white"
          dense
          no-caps
          unelevated
          @click="signOut"
        />
      </q-tab-panel>

    </q-tab-panels>

  </div>
</template>

<script>
import chAxios from 'src/ajax'
import moment from 'moment'
import { shell } from 'electron'

import PageHeader from 'components/PageHeader'
import SettingsBtn from 'components/Profile/SettingsBtn'

export default {
  name: 'ProfilePage',
  components: {
    PageHeader,
    SettingsBtn,
  },
  data () {
    return {
      profile: null,
      tab: 'profile',
    }
  },
  watch: {
    '$route.params.userId': {
      handler () {
        this.getProfile()
      },
    },
  },
  created () {
    this.getProfile()
  },
  methods: {
    moment,
    async getProfile () {

      const data = {
        user_id: this.$route.params.userId ?? this.$store.getters['auth/userId'],
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
    openLinkInBrowser (link) {
      shell.openExternal(link)
    },
    goToProfile (userId) {
      this.$router.push({ name: 'profile', params: { userId: userId } })
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

.photo-xs {
  width: 2.4rem;
  height: 2.4rem;
}

.bio {
  font-size: 0.825rem;
  white-space: pre-line;
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
