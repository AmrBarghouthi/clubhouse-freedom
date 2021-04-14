<template>
  <div class="fixed-center">
    <q-form
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
    </q-form>
  </div>
</template>

<script>
import ajax from '../../ajax'
import Vue from 'vue'

export default {
  name: 'Login',
  data (){
    return {
      number: '',
      code: '',
      smsSent: false,
    }
  },
  methods: {
    backPressed (){
      this.smsSent = false
      this.code = ''
    },
    nextPressed (){
      if (!this.smsSent)
        this.getVerficationSMS()
      else
        this.submitCode()
    },
    async getVerficationSMS () {
      ajax
        .post('start_phone_number_auth', {
          phone_number: this.number,
        })
        .then(res => this.handleSMSSendResponse(res.data))
        .catch(err => this.handleVerficationErorr(err))
    },
    handleVerficationErorr (err){
      if (err.response)
        this.handleSMSSendResponse(err.response.data)
      else
        console.log(err)
    },
    handleSMSSendResponse (data) {
      console.log(data)
      if (data.is_blocked) {
        alert('your account is blocked')
      } else if (data.success) {
        this.smsSent = true
      } else alert(data.error_message)
    },
    submitCode () {
      ajax
        .post('complete_phone_number_auth', {
          phone_number: this.number,
          verification_code: this.code,
        })
        .then(res => this.handleLoginSuccess(res.data))
        .catch(err => this.handleLoginFail(err))
    },
    handleLoginSuccess (data) {
      console.log(data)
      Vue.prototype.$authdata = data
      localStorage.setItem('authData', JSON.stringify(data))
      this.$router.push({ name: 'index' })
    },
    handleLoginFail (data) {
      console.log(data)
    },
  },
}
</script>

<style></style>
