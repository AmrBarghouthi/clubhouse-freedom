<template>
  <div
    class="cursor-pointer"
    @click="openLinkInBrowser(`https://twitter.com/${handle}`)"
  >
    <q-icon
      name="fab fa-twitter"
      class="text-secondary"
    />
    <span class="text-weight-medium q-ml-xs">{{ handle }}</span>
  </div>
</template>

<script>
import OpensLinksInBrowser from 'src/mixins/OpensLinksInBrowser'

export default {
  name: 'ProfileSocialHandleTwitter',
  mixins: [
    OpensLinksInBrowser,
  ],
  props: {
    handle: {
      type: String,
      required: true,
    },
  },
}
</script>
