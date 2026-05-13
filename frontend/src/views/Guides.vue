<script>
import { mapActions } from 'vuex'

export default {
  name: 'Guides',
  data () {
    return {
      isLoading: true,
      guides: []
    }
  },
  async mounted () {
    await this.fetchGuides()
    this.guides = this.$store.state.guides
    this.isLoading = false
  },
  methods: {
    ...mapActions(['fetchGuides'])
  }
}
</script>

<template lang="pug">
.guides
  h1 Guides
  p(v-if="isLoading") Please wait...
  div(v-else)
    p There are {{ guides.length }} guides.
    ol
      li(v-for="guide in guides" :key="guide._id")
        router-link(:to="`/guides/${guide._id}`") {{ guide.name }}
        |  — {{ guide.location }} (Rating: {{ guide.rating }})
</template>
