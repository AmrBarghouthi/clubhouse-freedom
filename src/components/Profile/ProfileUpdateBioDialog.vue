<template>
  <q-dialog
    :value="value"
    position="bottom"
    :persistent="busy"
    class="full-height"
    @input="$emit('input', $event)"
  >
    <div class="bg-alabaster q-pt-xl modal-top-raduis-sm q-px-lg stretch-modal">
      <div class="q-pt-xl text-center text-h6">
        Update your bio
      </div>
      <q-input
        :value="bio"
        type="textarea"
        outlined
        dense
        lazy-rules
        :readonly="busy"
        autofocus
        color="secondary"
        bg-color="white"
        class="q-mt-sm"
        @input="$emit('bioupdated', $event)"
      />
      <div class="text-center">
        <q-btn
          type="submit"
          label="Done"
          color="secondary"
          rounded
          unelevated
          no-caps
          style="min-width: 200px; max-width: 300px;"
          class="q-mt-md"
          :loading="busy"
          :readonly="busy"
          @click="$emit('done')"
        />
      </div>
    </div>
  </q-dialog>
</template>

<script>
export default {
  name: 'ProfileUpdateBioDialog',
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    bio: {
      type: String,
      default: '',
    },
    busy: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style>
.stretch-modal {
  min-height: calc(100vh - 2rem) !important;
}
</style>
