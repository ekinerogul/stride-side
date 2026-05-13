<script>
import { mapActions } from 'vuex'

export default {
  name: 'LoginView',
  data () {
    return {
      email: '',
      password: '',
      userType: 'athlete',
      error: ''
    }
  },
  methods: {
    ...mapActions(['loginAthlete', 'loginGuide']),
    async handleLogin () {
      this.error = ''
      try {
        if (this.userType === 'athlete') {
          await this.loginAthlete({ email: this.email, password: this.password })
        } else {
          await this.loginGuide({ email: this.email, password: this.password })
        }
        this.$router.push('/dashboard')
      } catch (e) {
        this.error = e.response?.data?.error?.message || 'Login failed'
      }
    }
  }
}
</script>

<template lang="pug">
.login
  h1 Login
  p.error(v-if="error") {{ error }}
  form(@submit.prevent="handleLogin")
    div
      label Login as:&nbsp;
      select(v-model="userType")
        option(value="athlete") Athlete
        option(value="guide") Guide
    div
      label Email:&nbsp;
      input(type="email" v-model="email" required)
    div
      label Password:&nbsp;
      input(type="password" v-model="password" required)
    button(type="submit") Login
  p
    | Don't have an account?&nbsp;
    router-link(to="/register") Register
</template>
