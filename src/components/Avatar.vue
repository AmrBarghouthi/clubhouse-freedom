<template>
  <div
    :class="{ 'cursor-pointer': clickable }"
    @click="$emit('click')"
  >
    <img
      v-if="src"
      :src="src"
      class="smooth-corners"
      :style="`width: ${size}; height: ${size};`"
    >
    <div
      v-else
      class="avatar-initials rounded-ch smooth-corners"
      :style="`width: ${size}; height: ${size}; font-size: ${size};`"
    >
      <span style="font-size: 0.4em;">{{ initials }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Avatar',
  props: {
    size: {
      type: String,
      default: '4rem',
    },
    src: {
      type: String,
      default: null,
    },
    name: {
      type: String,
      default: '',
    },
    clickable: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    initials () {
      const segments = this.name.trim().split(' ')

      if (segments[0] === '') {
        return 'CH'
      }

      if (segments.length === 1) {
        return segments[0][0]
      }

      return segments[0][0] + segments[segments.length - 1][0]
    },
  },
}
</script>

<style scoped>
.avatar-initials {
  display: grid;
  place-content: center;
  background-color: #f2f2f2;
  border: 2px solid #d5d5d5;
  color: grey;
}

.rounded-ch {
  border-radius: 42%;
}
</style>
