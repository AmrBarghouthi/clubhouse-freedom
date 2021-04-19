<template>
  <div class="bg-soapstone rounded-md full-width q-px-md q-py-sm">
    <div
      v-for="event in events"
      :key="event.event_id"
      class="q-my-xs"
      @click="$emit('eventClicked', { eventId: event.event_id })"
    >
      <div class="event">
        <div class="event-time-start text-judge-gray">
          {{ getEventStartTimeFormatted(event.time_start) }}
        </div>
        <div class="event-name">
          {{event.name}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'IndexEventsList',
  props: {
    events: {
      type: Array,
      required: true,
    },
    busy: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    getEventStartTimeFormatted (startTime) {
      return moment(startTime).format('LT')
    },
  },
}
</script>

<style>
.event {
  display: flex;
  min-width: 0;
  cursor: pointer;
}

.event-time-start {
  min-width: 8ch;
  text-align: right;
  margin-right: 2ch;
}

</style>
