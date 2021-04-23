<template>
  <div @click="$emit('click')">
    <div
      class="container"
      :style="`height: ${size}; width: ${size}; font-size: ${size}`"
    >
      <svg
        :width="size"
        :height="size"
        viewBox="0 0 1000 1000"
        xmlns="http://www.w3.org/2000/svg"
      >

        <path
          d="M0 500C0 145 145 0 500 0C855 0 1000 145 1000 500C1000 855 855 1000 500 1000C145 1000 0 855 0 500Z"
          :fill="mainPathFill"
          :transform="mainPathTransform"
        />

        <path
          v-if="!src"
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M500 0C145 0 0 145 0 500C0 855 145 1000 500 1000C855 1000 1000 855 1000 500C1000 145 855 0 500 0ZM500 10C152.1 10 10 152.1 10 500C10 847.9 152.1 990 500 990C847.9 990 990 847.9 990 500C990 152.1 847.9 10 500 10Z"
          fill="#d5d5d5"
          :transform="mainPathTransform"
        />

        <path
          v-if="glows && glowing"
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M500 0C145 0 0 145 0 500C0 855 145 1000 500 1000C855 1000 1000 855 1000 500C1000 145 855 0 500 0ZM500 32.2581C167.903 32.2581 32.2581 167.903 32.2581 500C32.2581 832.097 167.903 967.742 500 967.742C832.097 967.742 967.742 832.097 967.742 500C967.742 167.903 832.097 32.2581 500 32.2581Z"
          fill="#cacdb0"
        />

        <pattern
          :id="src"
          patternUnits="userSpaceOnUse"
          width="1000"
          height="1000"
        >
          <image
            :href="src"
            width="1000"
            height="1000"
          />
        </pattern>

      </svg>
      <div
        v-if="!src"
        class="initials-container"
      >
        <span class="initials-text">{{ initials }}</span>
      </div>

    </div>
  </div>
</template>

<script>
export default {
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
    glows: {
      type: Boolean,
      default: false,
    },
    glowing: {
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
    mainPathTransform () {
      return this.glows ? 'translate(50 50) scale(0.9)' : ''
    },
    mainPathFill () {
      return this.src ? `url(#${this.src})` : '#f2f2f2'
    },
  },
}
</script>

<style>
.container {
  position: relative;
  display: inline-grid;
}

.initials-container {
  position: absolute;
  display: inline-grid;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.initials-text {
  font-size: 0.35em;
  color: gray;
}

</style>
