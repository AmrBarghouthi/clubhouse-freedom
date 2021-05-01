<template>
  <q-dialog
    :value="show"
    position="top"
    seamless
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
          @click="$emit('dismiss')"
        />
        <q-btn
          label="Join as a speaker"
          rounded
          flat
          no-caps
          class="bg-white text-positive"
          @click="$emit('accept')"
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
    show: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
