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
            <ProfileSettingsBtn @click="tab = 'settings'" />
          </template>
        </PageHeader>

        <div
          v-if="profile"
          class="q-mx-md"
        >

          <Avatar
            :src="profile.photo_url"
            :name="profile.name"
            size="4.5rem"
            @click="photoClickHandler"
          />

          <ProfileNameAndUsername
            :name="profile.name"
            :username="profile.username"
            :follows-me="profile.follows_me"
            class="q-mt-sm"
          />

          <ProfileFollowingAndFollowers
            :followers-count="profile.num_followers"
            :following-count="profile.num_following"
            class="q-mt-sm"
          />

          <ProfileBio
            v-if="profile.bio"
            :bio="profile.bio"
            class="q-mt-lg"
            @click="bioClickHandler"
          />

          <ProfileAddBio
            v-else-if="canUpdateBio"
            class="q-mt-xl"
            @click="bioClickHandler"
          />

          <ProfileSocialHandleTwitter
            v-if="profile.twitter"
            :handle="profile.twitter"
            class="q-mt-md q-mr-lg inline-block"
          />

          <ProfileSocialHandleInstagram
            v-if="profile.instagram"
            :handle="profile.instagram"
            class="q-mt-md inline-block"
          />

          <div class="q-mt-xl nominated-by-container">
            <Avatar
              v-if="profile.invited_by_user_profile"
              :src="profile.invited_by_user_profile.photo_url"
              :name="profile.invited_by_user_profile.name"
              size="2.7rem"
              class="q-mr-sm"
              clickable
              @click="goToProfile(profile.invited_by_user_profile.user_id)"
            />
            <div>
              <ProfileJoinedLine :date="profile.time_created" />
              <ProfileNominatedByLine
                v-if="profile.invited_by_user_profile"
                :name="profile.invited_by_user_profile.name"
                @click="goToProfile(profile.invited_by_user_profile.user_id)"
              />
            </div>
          </div>

          <div v-if="profile.clubs.length">
            <div class="q-mt-lg q-mb-sm text-weight-medium text-grey-9">
              Member of
            </div>
            <div class="flex">
              <Avatar
                v-for="club in profile.clubs"
                :key="club.club_id"
                :src="club.photo_url"
                :name="club.name"
                clickable
                size="2.4rem"
                class="q-mr-sm q-mb-xs"
              />
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

    <ProfileUpdateBioDialog
      v-model="state.isShowingUpdateBioForm"
      :bio="form.bioUpdate.bio"
      :busy="state.isUpdatingBio"
      @bioupdated="$event => form.bioUpdate.bio = $event"
      @done="bioUpdateDoneHandler"
    />

    <ProfileUpdatePhotoDialog
      v-model="state.isShowingUpdatePhotoForm"
      :photo-url="photoUrl"
      :name="name"
      :busy="state.isUpdatingPhoto"
      @photoUpdated="$event => form.photoUpdate.photo = $event"
      @done="photoUpdateDoneHandler"
    />
  </div>
</template>

<script>
import chAxios from 'src/ajax'

import Avatar from 'components/Avatar'
import PageHeader from 'components/PageHeader'
import ProfileAddBio from 'components/Profile/ProfileAddBio'
import ProfileBio from 'components/Profile/ProfileBio'
import ProfileFollowingAndFollowers from 'components/Profile/ProfileFollowingAndFollowers'
import ProfileJoinedLine from 'components/Profile/ProfileJoinedLine'
import ProfileNameAndUsername from 'components/Profile/ProfileNameAndUsername'
import ProfileNominatedByLine from 'components/Profile/ProfileNominatedByLine'
import ProfileSettingsBtn from 'components/Profile/ProfileSettingsBtn'
import ProfileSocialHandleInstagram from 'components/Profile/ProfileSocialHandleInstagram'
import ProfileSocialHandleTwitter from 'components/Profile/ProfileSocialHandleTwitter'
import ProfileUpdateBioDialog from 'components/Profile/ProfileUpdateBioDialog'
import ProfileUpdatePhotoDialog from 'components/Profile/ProfileUpdatePhotoDialog'

export default {
  name: 'ProfilePage',
  components: {
    Avatar,
    PageHeader,
    ProfileAddBio,
    ProfileBio,
    ProfileFollowingAndFollowers,
    ProfileJoinedLine,
    ProfileNameAndUsername,
    ProfileNominatedByLine,
    ProfileSettingsBtn,
    ProfileSocialHandleInstagram,
    ProfileSocialHandleTwitter,
    ProfileUpdateBioDialog,
    ProfileUpdatePhotoDialog,
  },
  data () {
    return {
      profile: null,
      tab: 'profile',
      state: {
        isShowingUpdateBioForm: false,
        isUpdatingBio: false,
        isShowingUpdatePhotoForm: false,
        isUpdatingPhoto: false,
      },
      form: {
        bioUpdate: { bio: null },
        photoUpdate: { photo: null },
      },
    }
  },
  computed: {
    headers () {
      return {
        Authorization: `Token ${this.$store.getters['auth/authToken']}`,
        'CH-UserID': this.$store.getters['auth/userId'],
      }
    },
    name () {
      return this.profile?.name
    },
    photoUrl () {
      return this.profile?.photo_url
    },
    isAuthenticatedUserProfile () {
      return this.profile.user_id === this.$store.getters['auth/userId']
    },
    canUpdateBio () {
      return this.isAuthenticatedUserProfile
    },
    canUpdatePhoto () {
      return this.isAuthenticatedUserProfile
    },
  },
  beforeRouteUpdate(to, from, next) {
    this.getProfile(to.params.userId)
    next()
  },
  created () {
    this.getProfile(this.$route.params.userId)
  },
  methods: {
    async getProfile (userId) {
      this.profile = null

      const data = {
        user_id: userId ?? this.$store.getters['auth/userId'],
      }
      const headers = {
        Authorization: `Token ${this.$store.getters['auth/authToken']}`,
        'CH-UserID': this.$store.getters['auth/userId'],
      }
      chAxios
        .post('get_profile', data, { headers })
        .then(res => this.profile = res?.data?.user_profile ?? null)
    },
    back () {
      this.$router.back()
    },
    signOut () {
      this.$store.commit('auth/RESET')
      this.$router.push({ name: 'auth.login' })
    },
    goToProfile (userId) {
      this.$router.push({ name: 'profile', params: { userId: userId } })
    },
    bioClickHandler () {
      if (!this.canUpdateBio) return

      this.form.bioUpdate.bio = this.profile.bio
      this.state.isShowingUpdateBioForm = true
    },
    async bioUpdateDoneHandler () {
      this.state.isUpdatingBio = true

      if (this.profile.bio === this.form.bioUpdate.bio) {
        this.state.isUpdatingBio = false
        this.state.isShowingUpdateBioForm = false
        return
      }

      chAxios
        .post('update_bio', { bio: this.form.bioUpdate.bio }, { headers: this.headers })
        .then(res => { if (res?.data?.success) this.profile.bio = this.form.bioUpdate.bio })
        .finally(() => {
          this.state.isShowingUpdateBioForm = false
          this.state.isUpdatingBio = false
        })
    },
    photoClickHandler () {
      if (!this.canUpdatePhoto) return
      this.state.isShowingUpdatePhotoForm = true
    },
    async photoUpdateDoneHandler (event) {

      if (!event.photo) {
        this.state.isShowingUpdatePhotoForm = false
        return
      }

      const data = new FormData()
      data.append('file', event.photo, 'image.jpg')

      chAxios
        .post('update_photo', data, { headers: this.headers })
        .then(res => {
          if (res?.data?.photo_url) {
            this.profile.photo_url = res.data.photo_url
            this.$store.commit('auth/UPDATE_PHOTO_URL', res.data.photo_url)
          }
        })
        .finally(() => {
          this.state.isShowingUpdatePhotoForm = false
          this.state.isUpdatingPhoto = false
        })
    },
  },
}
</script>

<style>
.nominated-by-container {
  display: flex;
  align-items: center;
}

.social-media-container {
  display: flex;
  align-items: center;
}

.inline-block {
  display: inline-block;
}
</style>
