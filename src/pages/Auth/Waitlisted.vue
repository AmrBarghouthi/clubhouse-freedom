<template>
  <div>
    Waitlisted
    <SignOutButton />
    <SkipWaitlistButton />
  </div>
</template>

<script>
import SignOutButton from 'components/Auth/SignOutButton'
import SkipWaitlistButton from 'components/Auth/SkipWaitlistButton'

export default {
  name: 'AuthWaitlistedPage',
  components: {
    SignOutButton,
    SkipWaitlistButton,
  },
}
</script>
