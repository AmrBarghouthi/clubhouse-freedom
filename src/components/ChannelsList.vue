<template>
  <q-list>
    <div
      v-for="channel in channels"
      :key="channel.channel_id"
    >
      <q-item
        v-ripple
        clickable
        class="q-my-sm bg-white rounded-base shadow-down-on-alabaster-1"
      >
        <q-item-section>
          <q-item-label dir="auto">{{ channel.topic }}</q-item-label>
          <div class="flex q-mt-sm q-gutter-md">
            <div class="channels-list-avatars-container">
              <q-avatar
                v-if="channel.users.length > 0"
                size="2.5rem"
                class="channels-list-avatar-first smooth-corners"
                square
              >
                <img :src="channel.users[0].photo_url">
              </q-avatar>
              <q-avatar
                v-if="channel.users.length > 1"
                size="2.5rem"
                class="channels-list-avatar-second smooth-corners"
                square
              >
                <img :src="channel.users[1].photo_url">
              </q-avatar>
            </div>
            <div>
              <div
                v-for="userInChannel in channel.users"
                :key="userInChannel.user_id"
              >
                <span>{{ userInChannel.name}}</span>
                <q-icon
                  v-if="userInChannel.is_speaker"
                  name="o_sms"
                  class="q-ml-xs"
                />
              </div>
              <div class="q-mt-sm text-grey">
                <q-icon name="person" />
                <span>{{channel.num_all}}</span>
                <span class="q-mx-sm">/</span>
                <q-icon name="o_sms" />
                <span class="q-ml-xs">{{channel.num_speakers}}</span>
              </div>

            </div>
          </div>
        </q-item-section>
      </q-item>
    </div>
  </q-list>
</template>

<script>
import ajax from 'src/ajax'
export default {
  data () {
    return {
      channels: [],
    }
  },
  mounted () {
    this.fetchChannles()
  },
  methods: {
    async fetchChannles () {
      const authData = JSON.parse(localStorage.getItem('authData'))
      const url = 'get_channels'
      const options = {
        headers: {
          Authorization: `Token ${authData.auth_token}`,
          'CH-UserID': authData.user_profile.user_id,
        },
      }

      const response = await ajax.get(url, options)

      this.channels = response.data.channels
    },
  },
}
</script>

<style>
.channels-list-avatars-container {
  position: relative;
  width: 3.75rem;
  height: 3.75rem;
}

.channels-list-avatar-first {
  z-index: 1;
}

.channels-list-avatar-second {
  position: absolute;
  transform: translate(-50%, 50%);
}
</style>
