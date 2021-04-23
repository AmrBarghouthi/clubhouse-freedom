<template>
  <div @click="$emit('click')">
    <div class="text-weight-medium">{{ name }}</div>
    <div class="flex">
      <div>@{{ username }}</div>
      <div
        v-if="followsMe"
        class="text-grey-7 q-ml-lg"
      >
        follows you
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProfileNameAndUsername',
  props: {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    followsMe: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
