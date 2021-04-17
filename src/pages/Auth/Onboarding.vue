<template>
  <div>
    Onboarding
    <SignOutButton />
    <SkipOnboardingButton />
  </div>
</template>

<script>
import SignOutButton from 'components/Auth/SignOutButton'
import SkipOnboardingButton from 'components/Auth/SkipOnboardingButton'

export default {
  name: 'AuthOnboardingPage',
  components: {
    SignOutButton,
    SkipOnboardingButton,
  },
}
</script>
