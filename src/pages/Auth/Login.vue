<template>
  <div>
    <q-btn
      v-if="stage === 'AWAITING_VERIFICATION_CODE'"
      icon="chevron_left"
      class="absolute"
      flat
      :ripple="false"
      dense
      round
      fab
      @click="signInRestart"
    />
    <div class="q-mx-auto q-px-md centered">
      <PhoneNumberForm
        v-show="stage === 'NEW'"
        class="q-mx-auto full-width"
        :busy="state.isBusy"
        :loading="state.isBusy"
        @submit="signInGetSms($event)"
      />
      <SmsVerificationCodeForm
        v-show="stage === 'AWAITING_VERIFICATION_CODE'"
        class="q-mx-auto full-width"
        :busy="state.isBusy"
        :loading="state.isBusy"
        :attempts-remaining="numberOfSmsVerificationAttemptsRemaining"
        @submit="signInComplete"
        @resend-sms="signInResendSms"
        @get-via-call="signInGetCall"
      />
    </div>
  </div>

</template>

<script>
import chAxios from 'src/ajax'
import PhoneNumberForm from 'components/Auth/Login/PhoneNumberForm'
import SmsVerificationCodeForm from 'components/Auth/Login/SmsVerificationCodeForm'

export default {
  name: 'AuthLoginPage',
  components: {
    PhoneNumberForm,
    SmsVerificationCodeForm,
  },
  data () {
    return {
      state: {
        isBusy: false,
      },
      phoneNumber: '',
      verificationCode: '',
    }
  },
  computed: {
    hasRequstedSmsVerificationCode () {
      return this.$store.getters['auth/hasRequstedSmsVerificationCode']
    },
    numberOfSmsVerificationAttemptsRemaining () {
      return this.$store.getters['auth/numberOfSmsVerificationAttemptsRemaining']
    },
    isVerified () {
      return this.$store.getters['auth/isVerified']
    },
    stage () {
      if (this.hasRequstedSmsVerificationCode && this.numberOfSmsVerificationAttemptsRemaining !== 0) {
        return 'AWAITING_VERIFICATION_CODE'
      }
      else {
        return 'NEW'
      }
    },
  },
  watch: {
    numberOfSmsVerificationAttemptsRemaining (newVal) {
      if (newVal !== 0) {
        return
      }

      this.signInRestart()

      this.$q.notify({
        message: 'Too many varification attempts. You may use a different number of try again.',
        color: 'negative',
        position: 'top',
      })
    },
    isVerified (newVal) {
      if (newVal) {
        this.$router.push({ name: 'index' })
      }
    },
  },
  mounted () {
    this.signInRestart()
    if (this.$route.query.isBlocked) {
      this.$router.replace({ query: { isBlocked: false } })
      this.$q.notify({
        message: 'This account is blocked.',
        color: 'negative',
        position: 'top',
      })
    }
  },
  methods: {
    signInGetSms (phoneNumber) {
      this.phoneNumber = phoneNumber
      this.state.isBusy = true
      return chAxios
        .post('start_phone_number_auth', { phone_number: phoneNumber })
        .then(res => this.$store.commit('auth/UPDATE_SIGN_IN_ATTEMPT_STATE', res.data))
        .finally(() => this.state.isBusy = false)
    },
    signInResendSms () {
      this.state.isBusy = true
      return chAxios
        .post('resend_phone_number_auth', { phone_number: this.phoneNumber })
        .finally(() => this.state.isBusy = false)
    },
    signInGetCall () {
      this.state.isBusy = true
      return chAxios
        .post('call_phone_number_auth', { phone_number: this.phoneNumber })
        .finally(() => this.state.isBusy = false)
    },
    signInRestart () {
      this.$store.commit('auth/RESET')
      this.verificationCode = ''
    },
    signInComplete (verificationCode) {
      this.verificationCode = verificationCode
      this.state.isBusy = true
      return chAxios
        .post('complete_phone_number_auth', {
          phone_number: this.phoneNumber,
          verification_code: verificationCode,
        })
        .then(res => this.$store.commit('auth/UPDATE_COMPLETE_SIGN_IN_ATTEMPT_STATE', res.data))
        .finally(() => this.state.isBusy = false)
    },
  },
}
</script>

<style>
.centered {
  display: grid;
  place-items: center;
  height: 100vh;
  max-width: 320px;
}
</style>
