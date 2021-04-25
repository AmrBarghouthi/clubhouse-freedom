<template>
  <q-tab-panels
    v-model="panel"
    animated
    keep-alive
    class="bg-alabaster onboarding-fh"
  >
    <q-tab-panel
      name="enterName"
      class="onboarding-center-it"
    >
      <div />

      <q-form @submit="nameEntered">

        <div class="onboarding-top-text">
          What's your full name?
        </div>

        <div class="row q-gutter-x-xs">
          <q-input
            v-model="nameForm.first"
            outlined
            dense
            autofocus
            placeholder="First"
            color="secondary"
            bg-color="white"
            class="q-mt-lg onboarding-name-field"
            input-class="onboarding-name-input"
          />

          <q-input
            v-model="nameForm.last"
            outlined
            dense
            placeholder="Last"
            color="secondary"
            bg-color="white"
            class="q-mt-lg onboarding-name-field"
            input-class="onboarding-name-input"
          />

        </div>

        <div class="q-mt-md onboarding-bottom-text">
          People use real names on Clubhouse :) Thnx!
        </div>

        <NextButton />
      </q-form>

    </q-tab-panel>
    <q-tab-panel
      name="enterUsername"
      class="onboarding-center-it"
    >
      <div />

      <q-form @submit="panel = 'enterName'">

        <div class="onboarding-top-text">
          Pick a username
        </div>

        <q-input
          ref="usernameInput"
          v-model="usernameForm.username"
          outlined
          prefix="@"
          dense
          placeholder="Username"
          color="secondary"
          bg-color="white"
          class="q-mt-lg onboarding-name-field"
          input-class="onboarding-name-input"
        />


        <NextButton />

      </q-form>

    </q-tab-panel>
  </q-tab-panels>
</template>

<script>
import NextButton from 'components/Auth/NextButton'

export default {
  name: 'AuthOnboardingPage',
  components: {
    NextButton,
  },
  data () {
    return {
      panel: 'enterName',
      nameForm: {
        first: null,
        last: null,
      },
      usernameForm: {
        username: null,
      },
    }
  },
  methods: {
    nameEntered () {
      this.panel = 'enterUsername'
    },
    userNameEntered () {
      this.panel = 'enterName'
    },
  },
}
</script>

<style>
.onboarding-fh {
  height: 100vh;
}

.onboarding-center-it {
  display: grid;
  grid-template-rows: 1fr 2fr;
}

.onboarding-top-text {
  text-align: center;
  font-size: 1.4rem;;
}

.onboarding-bottom-text {
  text-align: center;
  color: gray;
}

.onboarding-name-field {
  flex: 1;
}

.onboarding-name-input {
  font-size: 1.5rem;
  text-align: center;
}
</style>
