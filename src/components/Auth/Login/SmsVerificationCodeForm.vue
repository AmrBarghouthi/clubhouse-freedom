<template>
  <q-form
    class="q-gutter-md"
    @submit="$emit('submit', smsVerificationCode)"
  >
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
        :disable="smsVerificationCode.length !== 4"
      />
    </div>
  </q-form>
</template>

<script>

export default {
  name: 'AuthLoginSmsVerificationForm',
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
      smsVerificationCode: '',
    }
  },
}
</script>

<style scoped>
.login-form-top-text {
  text-align: center;
  font-size: 1.2rem;
}
</style>
