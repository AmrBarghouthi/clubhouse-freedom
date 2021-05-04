<template>
  <q-btn
    class="btn-think-borders"
    color="secondary"
    no-caps
    :outline="value !== 1"
    padding="none"
    round
    unelevated
    @click="onClick"
  >
    <q-icon
      class="notifications-type-btn-icon"
      :name="icon"
    />
  </q-btn>
</template>

<script>
import { ionNotifications, ionNotificationsOutline, ionNotificationsOffOutline } from '@quasar/extras/ionicons-v5'
import ProfileNotificationTypeUpdateDialog from './ProfileNotificationTypeUpdateDialog'

export default {
  name: 'ProfileNotificationTypeControl',
  props: {
    value: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  computed: {
    icon () {
      switch (this.value) {
        case 1: return ionNotifications
        case 2: return ionNotificationsOutline
        default: return ionNotificationsOffOutline
      }
    },
  },
  methods: {
    onClick () {
      this.$q
        .dialog({
          component: ProfileNotificationTypeUpdateDialog,
          name: this.name,
          type: this.value,
        })
        .onOk(payload => this.$emit('input', payload.notificationType))
    },
  },
}
</script>

<style scoped>
.notifications-type-btn-icon {
  font-size: 1rem;
  padding: 0.35rem;
}
</style>
