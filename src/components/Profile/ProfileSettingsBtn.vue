<template>
  <q-icon
    :name="ionCogOutline"
    role="button"
    :size="size"
    class="cursor-pointer"
    @click="$emit('click')"
  />
</template>

<script>
import { ionCogOutline } from '@quasar/extras/ionicons-v5'

export default {
  props: {
    size: {
      type: String,
      default: '1.7rem',
    },
  },
  data () {
    return {
      ionCogOutline,
    }
  },
}
</script>
