<template>
  <div class="bg-alabaster q-mx-auto centered">
    <PhoneNumberForm
      v-if="!isAwaitingSms"
      style="min-width: 320px"
      class="q-mx-auto"
      :busy="state.isBusy"
      :loading="state.isBusy"
      @submit="signIn($event)"
    />
    <SmsVerificationCodeForm
      v-else
      style="min-width: 320px"
      class="q-mx-auto"
      :busy="state.isBusy"
      :loading="state.isBusy"
    />
    <!-- <q-form
      class="q-gutter-md"
      @submit="nextPressed"
      @reset="backPressed"
    >
      <q-input
        v-model="number"
        filled
        label="Your phone number"
        hint="+962796555666"
        lazy-rules
        :disable="smsSent"
        :rules="[val => (val && val.length > 0) || 'Please type your phone number']"
      />
      <q-input
        v-if="smsSent"
        v-model="code"
        filled
        label="4 Digit Code"
      />
      <div>
        <q-btn
          v-if="smsSent"
          label="Back"
          type="reset"
          color="primary"
          flat
          class="float-left"
        />
        <q-btn
          label="Next"
          type="submit"
          color="primary"
          class="float-right"
        />
      </div>
    </q-form> -->
  </div>
</template>

<script>

import PhoneNumberForm from 'components/Auth/Login/PhoneNumberForm'
import SmsVerificationCodeForm from 'components/Auth/Login/SmsVerificationCodeForm'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'LoginPage',
  components: {
    PhoneNumberForm,
    SmsVerificationCodeForm,
  },
  data () {
    return {
      state: {
        isBusy: false,
      },
    }
  },
  computed: {
    ...mapGetters({
      isAwaitingSms: 'auth/getIsAwaitingSmsVerificationCode',
    }),
  },
  methods: {
    ...mapActions({
      startPhoneNumberAuth: 'auth/startPhoneNumberAuth',
    }),
    signIn (phoneNumber) {
      console.log(1)
      this.state.isBusy = true
      this.startPhoneNumberAuth(phoneNumber)
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
