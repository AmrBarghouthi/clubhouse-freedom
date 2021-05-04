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
        class="full-height q-pa-none"
      >
        <PageHeader
          back-btn
          @back="back"
        >
          <template #right>
            <ProfileSettingsBtn
              v-if="isAuthenticatedUserProfile"
              @click="tab = 'settings'"
            />
          </template>
        </PageHeader>

        <div
          v-if="profile"
          class="q-px-md"
        >
          <div class="row justify-between items-end">
            <Avatar
              :src="profile.photo_url"
              :name="profile.name"
              size="4.5rem"
              style="display: inline-block;"
              @click="photoClickHandler"
            />
            <ProfileFollowAndNotifications
              v-if="!isAuthenticatedUserProfile"
              :name="profile.name"
              :notifications-type="profile.notification_type"
              :following="isFollowing"
              @notificationtypeupdated="updateNotificationType"
              @follow="follow"
              @unfollow="unfollow"
            />
          </div>

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

          <ProfileSocialHandles
            :twitter="profile.twitter"
            :instagram="profile.instagram"
            class="q-mt-md"
          />

          <ProfileNominatedByBlock
            :nominated-by-name="profile.invited_by_user_profile.name"
            :nominated-by-photo-url="profile.invited_by_user_profile.photo_url"
            :joined-date="profile.time_created"
            class="q-mt-xl"
            @click="goToProfile(profile.invited_by_user_profile.user_id)"
          />

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
        v-if="isAuthenticatedUserProfile"
        name="settings"
        class="full-height q-pa-none"
      >
        <PageHeader
          exit-btn
          @exit="tab = 'profile'"
        >
          <span class="text-weight-medium">
            SETTINGS
          </span>
        </PageHeader>
        <div class="q-px-md">
          <q-btn
            class="q-mt-xl q-mx-md full-width text-red"
            label="Log out"
            color="white"
            dense
            no-caps
            unelevated
            @click="signOut"
          />
        </div>
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
import Avatar from 'components/Avatar'
import PageHeader from 'components/PageHeader'
import ProfileAddBio from 'components/Profile/ProfileAddBio'
import ProfileBio from 'components/Profile/ProfileBio'
import ProfileFollowAndNotifications from 'components/Profile/ProfileFollowAndNotifications'
import ProfileFollowingAndFollowers from 'components/Profile/ProfileFollowingAndFollowers'
import ProfileNameAndUsername from 'components/Profile/ProfileNameAndUsername'
import ProfileNominatedByBlock from 'components/Profile/ProfileNominatedByBlock'
import ProfileSettingsBtn from 'components/Profile/ProfileSettingsBtn'
import ProfileSocialHandles from 'components/Profile/ProfileSocialHandles'
import ProfileUpdateBioDialog from 'components/Profile/ProfileUpdateBioDialog'
import ProfileUpdatePhotoDialog from 'components/Profile/ProfileUpdatePhotoDialog'

export default {
  name: 'ProfilePage',
  components: {
    Avatar,
    PageHeader,
    ProfileAddBio,
    ProfileBio,
    ProfileFollowAndNotifications,
    ProfileFollowingAndFollowers,
    ProfileNameAndUsername,
    ProfileNominatedByBlock,
    ProfileSettingsBtn,
    ProfileSocialHandles,
    ProfileUpdateBioDialog,
    ProfileUpdatePhotoDialog,
  },
  beforeRouteUpdate (to, from, next) {
    this.getProfile(to.params.userId)
    next()
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
    name () {
      return this.profile?.name
    },
    photoUrl () {
      return this.profile?.photo_url
    },
    isAuthenticatedUserProfile () {
      return this.profile?.user_id === this.$store.getters['auth/userId']
    },
    canUpdateBio () {
      return this.isAuthenticatedUserProfile
    },
    canUpdatePhoto () {
      return this.isAuthenticatedUserProfile
    },
    isFollowing () {
      return this.$store.state.me.followingIds.find(id => this.profile.user_id == id) !== undefined
    },
  },
  created () {
    this.getProfile(this.$route.params.userId)
  },
  methods: {
    async getProfile (userId, clearPervious = true) {
      if (clearPervious) {
        this.profile = null
      }

      this.$clubhouseApi.getProfile(userId ?? this.$store.getters['auth/userId'])
        .then(data => this.profile = data?.user_profile ?? null)
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
      if (!this.canUpdateBio) {
        return
      }

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

      this.$clubhouseApi
        .updateBio(this.form.bioUpdate.bio)
        .then(data => {
          if (data?.success) {
            this.profile.bio = this.form.bioUpdate.bio
          }
        })
        .finally(() => {
          this.state.isShowingUpdateBioForm = false
          this.state.isUpdatingBio = false
        })
    },
    photoClickHandler () {
      if (!this.canUpdatePhoto) {
        return
      }
      this.state.isShowingUpdatePhotoForm = true
    },
    async photoUpdateDoneHandler (event) {

      if (!event.photo) {
        this.state.isShowingUpdatePhotoForm = false
        return
      }

      this.state.isUpdatingPhoto = true

      this.$clubhouseApi
        .updatePhoto(event.photo)
        .then(data => {
          if (data?.photo_url) {
            this.profile.photo_url = data.photo_url
            this.$store.commit('auth/UPDATE_PHOTO_URL', data.photo_url)
          }
        })
        .finally(() => {
          this.state.isShowingUpdatePhotoForm = false
          this.state.isUpdatingPhoto = false
        })
    },
    follow () {
      this.$clubhouseApi
        .follow(this.profile.user_id)
        .then(() => {
          this.$store.commit('me/INSERT_IN_FOLLOWING', { userId: this.profile.user_id })
          this.getProfile(this.$route.params.userId, false)
        })
        .catch(err => console.log(err))
    },
    unfollow () {
      this.$clubhouseApi
        .unfollow(this.profile.user_id)
        .then(() => this.$store.commit('me/REMOVE_FROM_FOLLOWING', { userId: this.profile.user_id }))
        .catch(err => console.log(err))
    },
    updateNotificationType (notificaitonType) {
      this.$clubhouseApi
        .updateFollowNotifications(this.profile.user_id, notificaitonType)
        .then(() => this.profile.notification_type = notificaitonType)
    },
  },
}
</script>
