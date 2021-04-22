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
        <q-avatar
          size="md"
          square
          @click="$emit('profilephotoclick')"
        >
          <img :src="$store.getters['auth/profilePhotoUrl']">
        </q-avatar>
      </q-btn>

    </div>
  </q-toolbar>
</template>
