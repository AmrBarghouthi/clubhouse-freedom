<template>
  <q-toolbar>
    <q-btn
      flat
      round
      icon="search"
      size="md"
    />
    <q-space />
    <div>
      <q-btn
        flat
        round
        icon="o_date_range"
        size="md"
        outline
      />
      <q-btn
        flat
        round
        icon="o_notifications"
        size="md"
        outline
      />
      <q-btn
        padding="none"
        flat
        class="smooth-corners q-ml-sm"
      >
        <Avatar
          :src="$store.getters['auth/profilePhotoUrl']"
          :name="$store.getters['auth/name']"
          size="2.3rem"
          @click="$emit('profilephotoclick')"
        />
      </q-btn>

    </div>
  </q-toolbar>
</template>

<script>
import Avatar from 'components/Avatar'

export default {
  name: 'IndexTopToolbar',
  components: {
    Avatar,
  },
}
</script>
