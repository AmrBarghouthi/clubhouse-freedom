<template>
  <div class="speakers-grid">
    <div
      v-for="speaker in speakers"
      :key="speaker.user_id"
      class="text-center"
    >
      <Avatar
        size="5.5rem"
        :src="speaker.photo_url"
        :name="speaker.name"
        class="q-mb-sm"
        glows
        :glowing="speakingSpeakersIds.has(speaker.user_id)"
        :muted="mutedSpeakersIds.has(speaker.user_id)"
      />
      <div class="speaker-info-line">
        <RoomSpeakerAsterisk
          v-if="speaker.is_moderator"
          class="speaker-asterisk"
        />
        <span class="speaker-name">
          {{ speaker.first_name }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import Avatar from 'components/Avatar'
import RoomSpeakerAsterisk from 'components/Room/RoomSpeakerAsterisk'

export default {
  name: 'RoomSpeakersSection',
  components: {
    Avatar,
    RoomSpeakerAsterisk,
  },
  props: {
    speakers: {
      type: Array,
      default: () => [],
    },
    mutedSpeakersIds: {
      type: Set,
      required: true,
    },
    speakingSpeakersIds: {
      type: Set,
      required: true,
    },
  },
}
</script>

<style scoped>
.speakers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, 5.5rem);
  justify-content: space-between;
  row-gap: 1rem;
}

.speaker-info-line {
  display: flex;
  justify-content: center;
  align-items: center;
}

.speaker-asterisk {
  min-width: 1rem;
  width: 1rem;
  min-height: 1rem;
  height: 1rem;
}

.speaker-name  {
  flex-grow: 0;
  margin-left: 0.175rem;
  font-weight: 700;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
