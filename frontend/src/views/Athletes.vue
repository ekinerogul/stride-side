<script>
import { mapActions } from 'vuex'

export default {
  name: 'Athletes',
  data () {
    return {
      isLoading: true,
      athletes: []
    }
  },
  async mounted () {
    await this.fetchAthletes()
    this.athletes = this.$store.state.athletes
    this.isLoading = false
  },
  methods: {
    ...mapActions(['fetchAthletes'])
  }
}
</script>

<template lang="pug">
.athletes
  h1 Athletes
  p(v-if="isLoading") Please wait...
  div(v-else)
    p There are {{ athletes.length }} athletes.
    ol
      li(v-for="athlete in athletes" :key="athlete._id")
        router-link(:to="`/athletes/${athlete._id}`") {{ athlete.name }}
        |  — {{ athlete.location }} ({{ athlete.disabilityType }})
</template>
