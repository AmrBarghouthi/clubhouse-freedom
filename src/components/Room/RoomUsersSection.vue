<template>
  <div>
    <div
      v-if="sectionTitle"
      class="users-section-title"
    >
      {{ sectionTitle }}
    </div>

    <div class="users-grid">
      <div
        v-for="user in users"
        :key="user.user_id"
        class="text-center"
      >
        <Avatar
          size="4rem"
          :src="user.photo_url"
          :name="user.name"
          class="q-mb-sm"
        />
        <div class="user-name">
          {{ user.first_name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Avatar from 'components/Avatar'

export default {
  name: 'RoomUsersSection',
  components: {
    Avatar,
  },
  props: {
    users: {
      type: Array,
      default: () => [],
    },
    sectionTitle: {
      type: String,
      default: null,
    },
  },
}
</script>

<style scoped>
.users-section-title {
  color: grey;
  font-weight: 700;
  margin-bottom: 1.5rem;
}

.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, 4.5rem);
  justify-content: space-between;
  row-gap: 1rem;
}

.user-name  {
  flex-grow: 0;
  margin-left: 0.175rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
