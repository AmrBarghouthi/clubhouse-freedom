<template>
  <div>
    <BackBtn
      v-if="hasRequstedSmsVerificationCode"
      class="auth-login-back-btn"
      @click="signInRestart"
    />
    <div class="q-mx-auto q-px-md centered">
      <PhoneNumberForm
        v-if="!hasRequstedSmsVerificationCode"
        transition-show="slide-right"
        class="q-mx-auto full-width"
        :busy="isBusy"
        :loading="isBusy"
        @submit="signInGetSms($event)"
      />
      <SmsVerificationCodeForm
        v-else
        transition-show="slide-right"
        class="q-mx-auto full-width"
        :busy="isBusy"
        :loading="isBusy"
        :attempts-remaining="numberOfAttemptsRemaining"
        @submit="signInComplete"
        @resend-sms="signInResendSms"
        @get-via-call="signInGetCall"
      />
    </div>
  </div>

</template>

<script>
import BackBtn from 'components/BackBtn'
import PhoneNumberForm from 'components/Auth/Login/PhoneNumberForm'
import SmsVerificationCodeForm from 'components/Auth/Login/SmsVerificationCodeForm'

export default {
  name: 'AuthLoginPage',
  components: {
    BackBtn,
    PhoneNumberForm,
    SmsVerificationCodeForm,
  },
  data () {
    return {
      isBusy: false,
      phoneNumber: '',
      verificationCode: '',
      hasRequstedSmsVerificationCode: false,
      numberOfAttemptsRemaining: null,
    }
  },
  mounted () {
    this.signInRestart()
  },
  methods: {
    signInRestart () {
      this.$store.commit('auth/RESET')
      this.hasRequstedSmsVerificationCode = null
      this.verificationCode = null
      this.numberOfAttemptsRemaining = null
    },
    signInGetSms (phoneNumber) {
      this.phoneNumber = phoneNumber
      this.isBusy = true
      this.$clubhouseApi
        .startPhoneNumberAuth(phoneNumber)
        .then(res => {
          if (res?.is_blocked) {
            this.$router.push({ name: 'auth.blocked' })
          } else if (res?.success) {
            this.hasRequstedSmsVerificationCode = true
          }
        })
        .catch(err => {
          if (err?.response?.data?.error_message !== null) {
            this.$q.notify({
              message: err.response.data.error_message,
              color: 'negative',
              position: 'top',
            })
          }
        })
        .finally(() => this.isBusy = false)
    },
    signInResendSms () {
      this.isBusy = true
      this.$clubhouseApi
        .resendPhoneNumberAuth(this.phoneNumber)
        .then(res => {
          if (res?.is_blocked) {
            this.$route.push({ name: 'auth.blocked' })
          } else if (res?.success) {
            this.hasRequstedSmsVerificationCode = true
          }
        })
        .finally(() => this.isBusy = false)
    },
    signInGetCall () {
      this.isBusy = true
      this.$clubhouseApi
        .callPhoneNumberAuth(this.phoneNumber)
        .then(res => {
          if (res?.is_blocked) {
            this.$route.push({ name: 'auth.blocked' })
          }
        })
        .finally(() => this.isBusy = false)
    },
    signInComplete (verificationCode) {
      this.verificationCode = verificationCode
      this.isBusy = true
      this.$clubhouseApi
        .completePhoneNumberAuth(this.phoneNumber, verificationCode)
        .then(res => {
          if (res?.number_of_attempts_remaining !== undefined) {
            this.onNumberOfAttemptsRemaining(res.number_of_attempts_remaining)
          } else if (res?.is_verified) {
            this.$store.commit('auth/SET_SUCCESSFUL_SIGNIN_DATA', res)
            this.redirectAfterSuccessfulSignIn()
          }
        })
        .finally(() => this.isBusy = false)
    },
    onNumberOfAttemptsRemaining (numberOfAttemptsRemaining) {
      const hasChanged = this.numberOfAttemptsRemaining !== numberOfAttemptsRemaining
      this.numberOfAttemptsRemaining = numberOfAttemptsRemaining

      if (!hasChanged) {
        this.$q.notify({
          message: 'Could\'nt verify your credentials.',
          color: 'negative',
          position: 'top',
        })
        this.signInRestart()
        return
      }

      if (numberOfAttemptsRemaining !== 0) {
        this.$q.notify({
          message: `Incorrect verification code. Attemps remaining: ${numberOfAttemptsRemaining}.`,
          color: 'negative',
          position: 'top',
        })
        return
      }

      if (numberOfAttemptsRemaining === 0) {
        this.$q.notify({
          message: 'Too many failed verification attempts. You may use a different number of try again.',
          color: 'negative',
          position: 'top',
        })
        this.signInRestart()
        return
      }
    },
    redirectAfterSuccessfulSignIn () {
      const isOnboarding = this.$store.getters['auth/isOnboarding']
      const isWaitlisted = this.$store.getters['auth/isWaitlisted']

      const shouldRedirectToOnboarding = isOnboarding
      const shouldRedirectToWaitlisted = !shouldRedirectToOnboarding && isWaitlisted

      if (shouldRedirectToOnboarding) {
        this.$router.push({ name: 'auth.onboarding' })
      } else if (shouldRedirectToWaitlisted) {
        this.$router.push({ name: 'auth.waitlisted' })
      } else {
        this.$router.push({ name: 'hallway' })
      }
    },
  },
}
</script>

<style>
.auth-login-back-btn {
  width: 0.7rem;
  position: absolute;
  top: 1rem;
  left: 1rem;
  cursor: pointer;
}

.centered {
  display: grid;
  place-items: center;
  height: 100vh;
  max-width: 320px;
}
</style>
