<template>
  <q-page class="bg-alabaster">
    <ChannelsList class="q-mx-md"/>
    <q-page-sticky
      position="bottom"
      :offset="[18, 18]"
    >
      <q-btn
        icon="add"
        color="primary"
        rounded
        no-caps
      >
        Start a room
      </q-btn>
    </q-page-sticky>
  </q-page>
</template>

<script>
import ChannelsList from 'components/ChannelsList'
export default {
  name: 'PageIndex',
  components: {
    ChannelsList,
  },
}
</script>
