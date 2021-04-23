<template>
  <q-dialog
    :value="value"
    position="bottom"
    :persistent="busy"
    class="full-height"
    @input="$emit('input', $event)"
  >
    <div class="bg-alabaster q-pt-xl q-px-lg modal-top-raduis-sm stretch-modal">
      <div class="q-pt-xl text-center text-h6">
        Update your photo
      </div>

      <div class="text-center q-mt-md">
        <Avatar
          ref="avatar"
          :src="newPhotoSrc || photoUrl"
          size="7rem"
          clickable
          @click="photoClicked"
        />
      </div>

      <input
        ref="fileInput"
        type="file"
        accept="image/jpeg"
        hidden
        @change="fileSelectedHandler"
      >

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
          @click="doneClickHandler"
        />
      </div>
    </div>
  </q-dialog>
</template>

<script>
import Avatar from 'components/Avatar'

export default {
  name: 'ProfileUpdatePhotoDialog',
  components: {
    Avatar,
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    photoUrl: {
      type: String,
      default: '',
    },
    busy: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      photo: null,
      newPhotoSrc: null,
    }
  },
  methods: {
    photoClicked () {
      this.$refs.fileInput.click()
    },
    fileSelectedHandler (event) {
      if (!event.target.files[0]) {
        return
      }

      this.photo = event.target.files[0]

      const reader = new FileReader()

      reader.onload = e => {
        this.newPhotoSrc = e.target.result
      }

      reader.readAsDataURL(this.photo)
    },
    doneClickHandler () {
      this.$emit('done', { photo: this.photo })
      this.photo = null
    },
  },
}
</script>

<style>
.stretch-modal {
  min-height: calc(100vh - 2rem) !important;
  min-width: 100vw;
}
</style>
