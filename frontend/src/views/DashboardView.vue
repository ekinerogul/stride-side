<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'DashboardView',
  data () {
    return {
      isLoading: true,
      mySessions: [],
      showCreateForm: false,
      newSession: {
        date: '',
        hour: '',
        location: '',
        distance: '',
        description: ''
      },
      createError: ''
    }
  },
  computed: {
    ...mapState(['user', 'userType'])
  },
  async mounted () {
    this.mySessions = await this.fetchMySessions()
    this.isLoading = false
  },
  methods: {
    ...mapActions(['fetchMySessions', 'createSession']),
    async handleCreateSession () {
      this.createError = ''
      try {
        await this.createSession({
          ...this.newSession,
          distance: Number(this.newSession.distance)
        })
        this.mySessions = await this.fetchMySessions()
        this.showCreateForm = false
        this.newSession = { date: '', hour: '', location: '', distance: '', description: '' }
      } catch (e) {
        this.createError = e.response?.data?.error?.message || 'Could not create session'
      }
    }
  }
}
</script>

<template lang="pug">
.dashboard
  p(v-if="isLoading") Please wait...
  div(v-else)
    h1 Welcome, {{ user && user.name }}
    p Role: {{ userType }}

    h2 My Sessions
    div(v-if="mySessions.length")
      ol
        li(v-for="session in mySessions" :key="session._id")
          router-link(:to="`/sessions/${session._id}`")
            | {{ session.location }} — {{ new Date(session.date).toLocaleDateString() }} at {{ session.hour }}
          |  ({{ session.status && session.status.current }})
    p(v-else) No sessions yet.

    h2 Create New Session
    button(@click="showCreateForm = !showCreateForm") {{ showCreateForm ? 'Cancel' : 'New Session' }}
    form(v-if="showCreateForm" @submit.prevent="handleCreateSession")
      p.error(v-if="createError") {{ createError }}
      div
        label Date:&nbsp;
        input(type="date" v-model="newSession.date" required)
      div
        label Hour:&nbsp;
        input(type="time" v-model="newSession.hour" required)
      div
        label Location:&nbsp;
        input(v-model="newSession.location" required)
      div
        label Distance (km):&nbsp;
        input(type="number" v-model="newSession.distance" required min="1")
      div
        label Description:&nbsp;
        textarea(v-model="newSession.description")
      button(type="submit") Create Session
</template>
