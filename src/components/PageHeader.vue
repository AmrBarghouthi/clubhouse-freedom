<template>
  <div class="container">
    <div class="left">
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

    <div class="text-weight-medium middle">
      <slot />
    </div>

    <div class="right">
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
  position: relative;
}

.left {
  position: absolute;
  top: 0;
  left: 0;
}

.middle {
  text-align: center;
  height: 3rem;
}

.right {
  position: absolute;
  top: 0;
  right: 0;
}
</style>
