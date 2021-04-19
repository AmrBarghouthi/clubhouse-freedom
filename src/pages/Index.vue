<template>
  <q-page class="bg-alabaster">
    <RoomsList class="q-mx-md"/>
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
import RoomsList from 'components/Index/RoomsList'
export default {
  name: 'PageIndex',
  components: {
    RoomsList,
  },
}
</script>
