<template>
  <div class="container">
    <q-icon
      :name="ionSearchOutline"
      class="cursor-pointer"
      role="button"
      size="1.7rem"
      @click="$emit('searchclick')"
    />

    <q-space />

    <q-icon
      :name="ionMailOpenOutline"
      size="1.7rem"
      class="q-mx-md cursor-pointer"
      role="button"
      @click="$emit('invitesclick')"
    />

    <q-icon
      :name="ionCalendarOutline"
      size="1.7rem"
      class="q-mx-md cursor-pointer"
      role="button"
      @click="$emit('eventsclick')"
    />

    <q-icon
      :name="ionNotificationsOutline"
      size="1.7rem"
      class="q-mx-md cursor-pointer"
      role="button"
      @click="$emit('notificationclick')"
    />

    <Avatar
      :src="$store.getters['auth/profilePhotoUrl']"
      :name="$store.getters['auth/name']"
      size="1.9rem"
      class="q-ml-md cursor-pointer"
      role="button"
      @click="$emit('profilephotoclick')"
    />

  </div>
</template>

<script>
import {
  ionCalendarOutline,
  ionMailOpenOutline,
  ionNotificationsOutline,
  ionSearchOutline,
} from '@quasar/extras/ionicons-v5'

import Avatar from 'components/Avatar'

export default {
  name: 'HallwayTopToolbar',
  components: {
    Avatar,
  },
  data () {
    return {
      ionCalendarOutline,
      ionMailOpenOutline,
      ionNotificationsOutline,
      ionSearchOutline,
    }
  },
}
</script>

<style scoped>
.container {
  display: flex;
  align-items: center;
}
</style>
