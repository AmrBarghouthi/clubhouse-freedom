<template>
  <div>
    <span class="text-grey-7">Nominated by</span>
    <span
      class="text-weight-medium text-black cursor-pointer"
      @click="$emit('click')"
    >
      {{ name }}
    </span>
  </div>
</template>

<script>
export default {
  name: 'ProfileNominatedByLine',
  props: {
    name: {
      type: String,
      required: true,
    },
  },
}
</script>
