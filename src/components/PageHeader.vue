<template>
  <div class="container">
    <div>
      <slot name="left">
        <q-btn
          v-show="backBtn"
          icon="chevron_left"
          flat
          :ripple="false"
          round
          size="lg"
          padding="none"
          @click="$emit('back')"
        />
      </slot>
    </div>

    <div class="text-weight-medium">
      <slot />
    </div>

    <div>
      <slot name="right">
        <q-btn
          v-show="exitBtn"
          icon="close"
          flat
          :ripple="false"
          round
          padding="none"
          @click="$emit('exit')"
        />
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PageHeader',
  props: {
    backBtn: {
      type: Boolean,
      default: false,
    },
    exitBtn: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style scoped>
.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
