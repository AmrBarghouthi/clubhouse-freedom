<template>
  <div class="row items-end q-gutter-x-sm">
    <ProfileNotificationTypeControl
      v-if="following"
      :name="name"
      :value="notificationsType"
      @input="$emit('notificationtypeupdated', $event)"
    />
    <ProfileFollowUnfollowBtn
      :value="following"
      @input="$emit(following ? 'unfollow' : 'follow')"
    />
  </div>
</template>

<script>
import ProfileFollowUnfollowBtn from './ProfileFollowUnfollowBtn'
import ProfileNotificationTypeControl from './ProfileNotificationTypeControl'

export default {
  name: 'ProfileFollowAndNotifications',
  components: {
    ProfileFollowUnfollowBtn,
    ProfileNotificationTypeControl,
  },
  props: {
    name: {
      type: String,
      required: true,
    },
    notificationsType: {
      type: Number,
      required: true,
    },
    following: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
