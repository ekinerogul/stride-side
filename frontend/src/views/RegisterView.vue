<script>
import { mapActions } from 'vuex'

export default {
  name: 'RegisterView',
  data () {
    return {
      userType: 'athlete',
      name: '',
      email: '',
      password: '',
      phone: '',
      location: '',
      languages: '',
      runningExperience: '',
      notes: '',
      disabilityType: '',
      disabilityLevel: 'low',
      usesGuideDog: false,
      error: ''
    }
  },
  methods: {
    ...mapActions(['registerAthlete', 'registerGuide']),
    async handleRegister () {
      this.error = ''
      try {
        const base = {
          name: this.name,
          email: this.email,
          password: this.password,
          phone: this.phone,
          location: this.location,
          languages: this.languages.split(',').map(l => l.trim()).filter(Boolean),
          runningExperience: this.runningExperience,
          notes: this.notes
        }
        if (this.userType === 'athlete') {
          await this.registerAthlete({
            ...base,
            disabilityType: this.disabilityType,
            disabilityLevel: this.disabilityLevel,
            usesGuideDog: this.usesGuideDog
          })
        } else {
          await this.registerGuide(base)
        }
        this.$router.push('/login')
      } catch (e) {
        this.error = e.response?.data?.error?.message || 'Registration failed'
      }
    }
  }
}
</script>

<template lang="pug">
.register
  h1 Register
  p.error(v-if="error") {{ error }}
  form(@submit.prevent="handleRegister")
    div
      label Register as:&nbsp;
      select(v-model="userType")
        option(value="athlete") Athlete
        option(value="guide") Guide
    div
      label Name:&nbsp;
      input(v-model="name" required)
    div
      label Email:&nbsp;
      input(type="email" v-model="email" required)
    div
      label Password:&nbsp;
      input(type="password" v-model="password" required minlength="6")
    div
      label Phone:&nbsp;
      input(v-model="phone" required)
    div
      label Location:&nbsp;
      input(v-model="location" required)
    div
      label Languages (comma-separated):&nbsp;
      input(v-model="languages" placeholder="English, Turkish")
    div
      label Running Experience:&nbsp;
      input(v-model="runningExperience")
    div
      label Notes:&nbsp;
      textarea(v-model="notes")
    template(v-if="userType === 'athlete'")
      div
        label Disability Type:&nbsp;
        input(v-model="disabilityType" required)
      div
        label Disability Level:&nbsp;
        select(v-model="disabilityLevel")
          option(value="low") Low
          option(value="medium") Medium
          option(value="high") High
      div
        label Uses Guide Dog:&nbsp;
        input(type="checkbox" v-model="usesGuideDog")
    button(type="submit") Register
  p
    | Already have an account?&nbsp;
    router-link(to="/login") Login
</template>
