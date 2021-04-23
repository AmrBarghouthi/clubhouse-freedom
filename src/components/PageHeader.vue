<template>
  <div class="container">
    <div class="left">
      <q-btn
        v-if="backBtn"
        icon="chevron_left"
        flat
        :ripple="false"
        round
        size="lg"
        padding="none"
        @click="$emit('back')"
      />
    </div>

    <div class="text-weight-medium middle">
      <slot />
    </div>

    <div class="right">
      <slot name="right">
        <q-btn
          v-if="exitBtn"
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
  min-height: 3.5rem;
  min-width: 100%;
}

.left {
  position: absolute;
  top: .5rem;
}

.middle {
  text-align: center;
  padding-top: .6rem;
}

.right {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
}
</style>
