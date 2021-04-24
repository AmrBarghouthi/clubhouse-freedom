<template>
  <q-icon
    :name="ionCloseOutline"
    role="button"
    :size="size"
    class="cursor-pointer"
    @click="$emit('click')"
  />
</template>

<script>
import { ionCloseOutline } from '@quasar/extras/ionicons-v5'

export default {
  props: {
    size: {
      type: String,
      default: '1.7rem',
    },
  },
  data () {
    return {
      ionCloseOutline,
    }
  },
}
</script>
