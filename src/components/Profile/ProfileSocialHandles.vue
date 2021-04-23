<template>
  <div class="flex">
    <ProfileSocialHandleTwitter
      v-if="twitter"
      :handle="twitter"
      class="q-mr-lg"
    />

    <ProfileSocialHandleInstagram
      v-if="instagram"
      :handle="instagram"
    />
  </div>
</template>

<script>
import ProfileSocialHandleInstagram from './ProfileSocialHandleInstagram'
import ProfileSocialHandleTwitter from './ProfileSocialHandleTwitter'

export default {
  name: 'ProfileSocialHandles',
  components: {
    ProfileSocialHandleInstagram,
    ProfileSocialHandleTwitter,
  },
  props: {
    instagram: {
      type: String,
      default: null,
    },
    twitter: {
      type: String,
      default: null,
    },
  },
}
</script>
