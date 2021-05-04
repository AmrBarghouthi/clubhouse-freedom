<template>
  <q-dialog
    ref="dialog"
    position="top"
    @hide="$emit('hide')"
  >
    <div class="q-ma-none q-pa-md bg-white full-width no-box-shadow">
      <div class="q-mb-md text-center text-weight-medium">
        When {{ name }} speaks, notify me
      </div>
      <div class="column q-gutter-y-sm">
        <q-btn
          v-for="t in notificationTypes"
          :key="t.id"
          class="full-width relative-position"
          :color="t.id === type ? 'secondary': ''"
          no-caps
          :outline="t.id !== type"
          unelevated
          @click="onSelectClick(t.id)"
        >
          <div>
            {{ t.name }}
          </div>
          <q-icon
            v-if="t.id === type"
            class="absolute"
            name="check"
            style="left:1rem;"
          />
        </q-btn>
      </div>
    </div>
  </q-dialog>
</template>

<script>
export default {
  name: 'ProfileNotificationTypeUpdateDialog',
  props: {
    name: {
      type: String,
      default: 'he or she',
    },
    type: {
      type: Number,
      required: true,
    },
  },
  computed: {
    notificationTypes () {
      return [
        { id: 1, name: 'Always' },
        { id: 2, name: 'Sometimes' },
        { id: 3, name: 'Never ever' },
      ]
    },
  },
  methods: {
    show () {
      this.$refs.dialog.show()
    },
    hide () {
      this.$refs.dialog.hide()
    },
    onSelectClick (typeId) {
      this.$emit('ok', { notificationType: typeId })
      this.hide()
    },
  },
}
</script>
