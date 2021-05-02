<template>
  <q-dialog
    ref="dialog"
    position="top"
    seamless
    @hide="$emit('hide')"
  >
    <div class="q-ma-none q-pa-md bg-positive text-white full-width no-box-shadow">
      <div>{{ inviterName }} invted you to speak</div>
      <div class="q-mt-md row q-gutter-x-md justify-end">
        <q-btn
          label="Maybe later?"
          rounded
          flat
          no-caps
          class="bg-positive-light text-white"
          @click="onCancelClick"
        />
        <q-btn
          label="Join as a speaker"
          rounded
          flat
          no-caps
          class="bg-white text-positive"
          @click="onAcceptClick"
        />
      </div>
    </div>
  </q-dialog>
</template>

<script>
export default {
  name: 'RoomInvitedToSpeakDialog',
  props: {
    inviterName: {
      type: String,
      default: 'Someone',
    },
  },
  methods: {
    show () {
      this.$refs.dialog.show()
    },
    hide () {
      this.$refs.dialog.hide()
    },
    onAcceptClick () {
      this.$emit('ok')
      this.hide()
    },
    onCancelClick () {
      this.hide()
    },
  },
}
</script>
