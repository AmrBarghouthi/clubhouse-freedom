<template>
  <div class="bg-alabaster q-mx-auto centered">
    <PhoneNumberForm
      v-show="!canEnterSmsVerificationCode"
      style="min-width: 320px"
      class="q-mx-auto"
      :busy="state.isBusy"
      :loading="state.isBusy"
      @submit="signInGetSms($event)"
    />
    <SmsVerificationCodeForm
      v-if="canEnterSmsVerificationCode"
      style="min-width: 320px"
      class="q-mx-auto"
      :busy="state.isBusy"
      :loading="state.isBusy"
      :attempts-remaining="numberOfSmsVerificationAttemptsRemaining"
      @submit="signInComplete"
      @get-via-call="signInGetCall"
    />
  </div>
</template>

<script>

import PhoneNumberForm from 'components/Auth/Login/PhoneNumberForm'
import SmsVerificationCodeForm from 'components/Auth/Login/SmsVerificationCodeForm'
import { mapGetters, mapActions } from 'vuex'

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
    }
  },
  computed: {
    ...mapGetters({
      canEnterSmsVerificationCode: 'auth/canEnterSmsVerificationCode',
      numberOfSmsVerificationAttemptsRemaining: 'auth/numberOfSmsVerificationAttemptsRemaining',
    }),
  },
  watch: {
    numberOfSmsVerificationAttemptsRemaining: {
      immediate: true,
      handler (newVal) {
        if (newVal === 0) {
          this.$q.notify({
            message: 'Too many varification attempts. You may use a different number of try again.',
            color: 'negative',
            position: 'top',
          })
          this.signInRestart()
        }
      },
    },
  },
  methods: {
    ...mapActions({
      startPhoneNumberAuth: 'auth/startPhoneNumberAuth',
      callPhoneNumberAuth: 'auth/callPhoneNumberAuth',
      restartAuthenticaton: 'auth/restartAuthenticaton',
      completePhoneNumberAuth: 'auth/completePhoneNumberAuth',
    }),
    signInGetSms (phoneNumber) {
      this.phoneNumber = phoneNumber
      this.state.isBusy = true
      this.startPhoneNumberAuth({ phoneNumber })
        .finally(() => this.state.isBusy = false)
    },
    signInGetCall () {
      const phoneNumber = this.phoneNumber
      this.state.isBusy = true
      this.callPhoneNumberAuth({ phoneNumber })
        .finally(() => this.state.isBusy = false)
    },
    signInRestart () {
      this.restartAuthenticaton()
    },
    signInComplete (verificationCode) {
      this.state.isBusy = true
      const payload = {
        phoneNumber: this.phoneNumber,
        verificationCode,
      }
      this.completePhoneNumberAuth(payload)
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
}
</style>
