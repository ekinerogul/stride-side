<script>
import { mapActions } from 'vuex'

export default {
  name: 'Guide',
  data () {
    return {
      isLoading: true,
      guide: null
    }
  },
  async mounted () {
    this.guide = await this.fetchGuide(this.$route.params.guideId)
    this.isLoading = false
  },
  methods: {
    ...mapActions(['fetchGuide'])
  }
}
</script>

<template lang="pug">
.guide
  p(v-if="isLoading") Please wait...
  div(v-else-if="guide")
    h1 {{ guide.name }}
    p Email: {{ guide.email }}
    p Phone: {{ guide.phone }}
    p Location: {{ guide.location }}
    p Languages: {{ guide.languages.join(', ') }}
    p Running Experience: {{ guide.runningExperience || 'N/A' }}
    p Rating: {{ guide.rating }}

    h2 Sessions
    div(v-if="guide.sessions && guide.sessions.length")
      ol
        li(v-for="session in guide.sessions" :key="session._id")
          router-link(:to="`/sessions/${session._id}`")
            | {{ session.location }} — {{ new Date(session.date).toLocaleDateString() }} at {{ session.hour }}
          |  ({{ session.status && session.status.current }})
    p(v-else) No sessions.
</template>
