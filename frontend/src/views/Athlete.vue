<script>
import { mapActions } from 'vuex'

export default {
  name: 'Athlete',
  data () {
    return {
      isLoading: true,
      athlete: null
    }
  },
  async mounted () {
    this.athlete = await this.fetchAthlete(this.$route.params.athleteId)
    this.isLoading = false
  },
  methods: {
    ...mapActions(['fetchAthlete'])
  }
}
</script>

<template lang="pug">
.athlete
  p(v-if="isLoading") Please wait...
  div(v-else-if="athlete")
    h1 {{ athlete.name }}
    p Email: {{ athlete.email }}
    p Phone: {{ athlete.phone }}
    p Location: {{ athlete.location }}
    p Languages: {{ athlete.languages.join(', ') }}
    p Running Experience: {{ athlete.runningExperience || 'N/A' }}
    p Disability: {{ athlete.disabilityType }} ({{ athlete.disabilityLevel }})
    p Uses Guide Dog: {{ athlete.usesGuideDog ? 'Yes' : 'No' }}
    p Rating: {{ athlete.rating }}

    h2 Sessions
    div(v-if="athlete.sessions && athlete.sessions.length")
      ol
        li(v-for="session in athlete.sessions" :key="session._id")
          router-link(:to="`/sessions/${session._id}`")
            | {{ session.location }} — {{ new Date(session.date).toLocaleDateString() }} at {{ session.hour }}
          |  ({{ session.status && session.status.current }})
    p(v-else) No sessions.
</template>
