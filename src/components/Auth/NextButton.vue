<template>
  <div class="text-center fixed-bottom q-mb-xl">
    <q-btn
      type="submit"
      label="Next"
      color="secondary"
      rounded
      unelevated
      no-caps
      icon-right="arrow_forward"
      style="min-width: 200px; max-width: 300px;"
      :loading="loading"
      :disable="disable"
    />
  </div>
</template>

<script>

export default {
  name: 'AuthNextButton',
  props: {
    loading: {
      type: Boolean,
      dafault: false,
    },
    disable: {
      type: Boolean,
      dafault: false,
    },
  },
}
</script>
