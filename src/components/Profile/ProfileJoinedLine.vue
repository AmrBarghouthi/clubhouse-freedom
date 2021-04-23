<template>
  <div class="text-grey-7">Joined {{ joinedDateFormatted }}</div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'ProfileJoinedLine',
  props: {
    date: {
      type: String,
      required: true,
    },
  },
  computed: {
    joinedDateFormatted () {
      return moment(this.date).format('MMM D, YYYY')
    },
  },
}
</script>
