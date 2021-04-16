<template>
  <q-form @submit="$emit('submit', parsedPhoneNumber)">
    <div class="login-form-top-text">
      Enter your phone #
    </div>

    <q-input
      v-model="phoneNumber"
      outlined
      dense
      square
      lazy-rules
      :readonly="busy"
      :rules="[() => isValidPhoneNumber || 'Please enter a valid phone number']"
      autofocus
      color="secondary"
      class="q-mt-lg"
    />

    <NextButton
      :loading="loading"
      :disable="!isValidPhoneNumber"
    />
  </q-form>
</template>

<script>
import NextButton from 'components/Auth/NextButton'
import parsePhoneNumber from 'libphonenumber-js'

export default {
  name: 'AuthLoginPhoneNumberForm',
  components: {
    NextButton,
  },
  props: {
    busy: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      phoneNumber: '+1',
    }
  },
  computed: {
    isValidPhoneNumber () {
      const val = parsePhoneNumber(this.phoneNumber)
      if (val) {
        return val.isValid()
      }
      return false
    },
    parsedPhoneNumber () {
      const val = parsePhoneNumber(this.phoneNumber)
      if (val) {
        return val.number
      }
      return this.phoneNumber
    },
  },
}
</script>

<style scoped>
.login-form-top-text {
  text-align: center;
  font-size: 1.2rem;
}
</style>
