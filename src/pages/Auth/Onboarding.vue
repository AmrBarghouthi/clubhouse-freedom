<template>
  <q-tab-panels
    v-model="panel"
    animated
    keep-alive
    class="bg-alabaster onboarding-fh"
  >
    <q-tab-panel
      name="name"
      class="onboarding-center-it"
    >
      <div />

      <q-form
        greedy
        @submit="updateName"
      >

        <div class="onboarding-top-text">
          What's your full name?
        </div>

        <div class="row q-gutter-x-xs">
          <q-input
            v-model="nameForm.first"
            outlined
            dense
            autofocus
            lazy-rules
            :rules="[val => val && val.length > 0 || 'First name is required']"
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
            lazy-rules
            :rules="[val => val && val.length > 0 || 'Last name is required']"
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

        <NextBtn
          :loading="state.isBusy"
          :disable="state.isBusy"
        />
      </q-form>

    </q-tab-panel>
    <q-tab-panel
      name="username"
      class="onboarding-center-it"
    >
      <div />

      <q-form @submit="updateUsername">

        <div class="onboarding-top-text">
          Pick a username
        </div>

        <q-input
          ref="usernameInput"
          v-model="usernameForm.username"
          outlined
          prefix="@"
          dense
          lazy-rules
          :rules="[val => val && val.length > 0 || 'You need to enter a username.']"
          placeholder="Username"
          color="secondary"
          bg-color="white"
          class="q-mt-lg onboarding-name-field"
          input-class="onboarding-name-input"
        />

        <NextBtn
          :loading="state.isBusy"
          :disable="state.isBusy"
        />

      </q-form>

    </q-tab-panel>
  </q-tab-panels>
</template>

<script>
import NextBtn from 'components/Auth/NextBtn'

export default {
  name: 'AuthOnboardingPage',
  components: {
    NextBtn,
  },
  data () {
    return {
      state: {
        isBusy: false,
      },
      panel: 'name',
      nameForm: {
        first: null,
        last: null,
      },
      usernameForm: {
        username: '',
      },
    }
  },
  mounted () {
    const name = this.$store.getters['auth/name']

    if (typeof name === 'string') {
      const nameSplit = name.split(' ')
      this.nameForm.first = nameSplit[0]
      this.nameForm.last = nameSplit[1]
    }

    const username = this.$store.getters['auth/username']

    if (typeof username === 'string') {
      this.usernameForm.username = username
    }
  },
  methods: {
    updateName () {
      this.state.isBusy = true
      const name = this.nameForm.first + ' ' + this.nameForm.last
      this.$clubhouseApi
        .updateName(name)
        .then(() => {
          this.$store.commit('auth/UPDATE_NAME', name)
          this.panel = 'username'
        })
        .catch(err => {
          if (err?.response?.data?.error_message) {
            this.onErrorMessage(err.response.data.error_message)
          } else {
            this.onUnknownError()
          }
        })
        .finally(() => {
          this.state.isBusy = false
        })
    },
    updateUsername () {
      this.state.isBusy = true
      const username = this.usernameForm.username
      this.$clubhouseApi
        .updateUsername(username)
        .then(() => {
          this.$store.commit('auth/UPDATE_USERNAME', username)
          if (this.$store.getters['auth/isWaitlisted']) {
            this.$router.push({ name: 'auth.waitlisted' })
            return
          }

          this.$router.push({ name: 'hallway' })
        })
        .catch(err => {
          if (err?.response?.data?.error_message) {
            this.onErrorMessage(err.response.data.error_message)
          } else {
            this.onUnknownError()
          }
        })
        .finally(() => {
          this.state.isBusy = false
        })
    },
    onErrorMessage (errorMessage) {
      this.$q.notify({
        type: 'negative',
        message: errorMessage,
        position: 'top',
        timeout: 5000,
      })
    },
    onUnknownError () {
      this.$q.notify({
        type: 'negative',
        message: 'Unexpected error occured.',
        position: 'top',
        timeout: 5000,
      })
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
