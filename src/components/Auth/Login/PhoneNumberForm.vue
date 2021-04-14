<template>
  <q-form
    class="q-gutter-md"
    @submit="$emit('submit', parsedPhoneNumber)"
  >
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
    />

    <div class="text-center">
      <q-spinner
        v-if="loading"
        color="secondary"
        size="md"
      />
      <q-btn
        v-else
        type="submit"
        label="Next"
        color="secondary"
        rounded
        unelevated
        no-caps
        icon-right="arrow_forward"
        style="min-width: 90%"
        :disable="!isValidPhoneNumber"
      />
    </div>
  </q-form>
</template>

<script>
import parsePhoneNumber from 'libphonenumber-js'

export default {
  name: 'AuthLoginPhoneNumberForm',
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
      phoneNumber: '+962785791553',
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
