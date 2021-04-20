<template>
  <div class="container">
    <div>
      <slot name="left">
        <q-btn
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

    <div><slot /></div>

    <div><slot name="right" /></div>
  </div>
</template>

<script>
export default {

}
</script>

<style scoped>
.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
