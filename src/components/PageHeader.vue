<template>
  <div class="container q-mx-md q-pt-md q-mb-sm">
    <div class="left">
      <slot name="left">
        <BackBtn
          v-if="backBtn"
          style="width: .7rem;"
          class="cursor-pointer"
          @click="$emit('back')"
        />
      </slot>
    </div>

    <div class="middle">
      <slot/>
    </div>

    <div class="right">
      <slot name="right">
        <CloseBtn
          v-if="exitBtn"
          class="cursor-pointer"
          @click="$emit('exit')"
        />
      </slot>
    </div>
  </div>
</template>

<script>
import BackBtn from 'components/BackBtn'
import CloseBtn from 'components/CloseBtn'

export default {
  name: 'PageHeader',
  components: {
    BackBtn,
    CloseBtn,
  },
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
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.middle {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%);
}
</style>
