<template>
  <div class="flex">
    <Avatar
      v-if="hasNominatedBy"
      :src="nominatedByPhotoUrl"
      :name="nominatedByName"
      size="2.7rem"
      class="q-mr-sm"
      clickable
      @click="$emit('click')"
    />
    <div>
      <ProfileJoinedLine :date="joinedDate" />
      <ProfileNominatedByLine
        v-if="hasNominatedBy"
        :name="nominatedByName"
        @click="$emit('click')"
      />
    </div>
  </div>
</template>

<script>
import Avatar from 'components/Avatar'
import ProfileJoinedLine from './ProfileJoinedLine'
import ProfileNominatedByLine from './ProfileNominatedByLine'

export default {
  name: 'ProfileNominatedByBlock',
  components: {
    Avatar,
    ProfileJoinedLine,
    ProfileNominatedByLine,
  },
  props: {
    joinedDate: {
      type: String,
      required: true,
    },
    nominatedByName: {
      type: String,
      default: null,
    },
    nominatedByPhotoUrl: {
      type: String,
      default: null,
    },
  },
  computed: {
    hasNominatedBy () {
      return this.nominatedByName
    },
  },
}
</script>
