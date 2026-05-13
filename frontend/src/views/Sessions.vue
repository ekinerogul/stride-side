<script>
import { mapActions } from 'vuex'

export default {
  name: 'Sessions',
  data () {
    return {
      isLoading: true,
      sessions: []
    }
  },
  async mounted () {
    await this.fetchSessions()
    this.sessions = this.$store.state.sessions
    this.isLoading = false
  },
  methods: {
    ...mapActions(['fetchSessions'])
  }
}
</script>

<template lang="pug">
.sessions
  h1 Sessions
  p(v-if="isLoading") Please wait...
  div(v-else)
    p There are {{ sessions.length }} sessions available.
    ol
      li(v-for="session in sessions" :key="session._id")
        router-link(:to="`/sessions/${session._id}`")
          | {{ session.location }} — {{ new Date(session.date).toLocaleDateString() }} at {{ session.hour }} — {{ session.distance }} km
        |  ({{ session.status && session.status.current }})
</template>
