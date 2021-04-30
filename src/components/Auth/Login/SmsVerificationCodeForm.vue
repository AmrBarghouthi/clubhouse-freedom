<template>
  <q-form @submit="$emit('submit', smsVerificationCode)">
    <div class="login-form-top-text">
      Enter the code we just texted you
    </div>

    <q-input
      v-model="smsVerificationCode"
      outlined
      dense
      square
      lazy-rules
      :readonly="busy"
      mask="####"
      autofocus
      :hint="hint"
      color="secondary"
      input-style="text-align: center"
      class="q-mt-md"
    />

    <div class="text-center">
      <q-btn
        label="Get via call instead"
        flat
        unelevated
        dense
        no-caps
        size="sm"
        @click="$emit('get-via-call')"
      />
      |
      <q-btn
        label="Resend verification code"
        flat
        unelevated
        dense
        no-caps
        size="sm"
        @click="$emit('resend-sms')"
      />
    </div>

    <NextBtn
      :loading="loading"
      :disable="smsVerificationCode.length !== 4"
    />
  </q-form>
</template>

<script>
import NextBtn from 'components/Auth/NextBtn'

export default {
  name: 'AuthLoginSmsVerificationForm',
  components: {
    NextBtn,
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
    attemptsRemaining: {
      type: Number,
      default: null,
      required: false,
    },
  },
  data () {
    return {
      smsVerificationCode: '',
    }
  },
  computed: {
    hint () {
      const attemptsRemaining = this.attemptsRemaining
      if (attemptsRemaining === null) {
        return null
      }

      return `Attempts remaining ${attemptsRemaining}`
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
