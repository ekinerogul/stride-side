<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'Session',
  data () {
    return {
      isLoading: true,
      session: null,
      applyError: '',
      statusError: '',
      reviewRating: 5,
      reviewNote: '',
      reviewError: ''
    }
  },
  computed: {
    ...mapState(['user', 'userType']),
    isOwner () {
      if (!this.session || !this.user) return false
      const ownerId = this.session.createdBy?._id || this.session.createdBy
      return String(ownerId) === String(this.user._id)
    },
    isParticipant () {
      if (!this.session || !this.user) return false
      const athleteId = this.session.athlete?._id || this.session.athlete
      const guideId = this.session.guide?._id || this.session.guide
      return String(athleteId) === String(this.user._id) || String(guideId) === String(this.user._id)
    },
    canApply () {
      return this.session?.status?.current === 'open' && !this.isOwner
    },
    canReview () {
      return this.session?.status?.current === 'completed' && this.isParticipant
    },
    allowedStatusTransitions () {
      if (!this.isOwner) return []
      const transitions = {
        open: ['cancelled'],
        applied: ['confirmed', 'cancelled'],
        confirmed: ['completed', 'cancelled'],
        completed: [],
        cancelled: []
      }
      return transitions[this.session?.status?.current] || []
    }
  },
  async mounted () {
    await this.refreshSession()
  },
  methods: {
    ...mapActions(['fetchSession', 'applyToSession', 'updateSessionStatus', 'reviewSession']),
    async refreshSession () {
      this.session = await this.fetchSession(this.$route.params.sessionId)
      this.isLoading = false
    },
    async handleApply () {
      this.applyError = ''
      try {
        await this.applyToSession(this.$route.params.sessionId)
        await this.refreshSession()
      } catch (e) {
        this.applyError = e.response?.data?.error?.message || 'Could not apply'
      }
    },
    async handleStatusChange (status) {
      this.statusError = ''
      try {
        await this.updateSessionStatus({ sessionId: this.$route.params.sessionId, status })
        await this.refreshSession()
      } catch (e) {
        this.statusError = e.response?.data?.error?.message || 'Could not update status'
      }
    },
    async handleReview () {
      this.reviewError = ''
      try {
        await this.reviewSession({
          sessionId: this.$route.params.sessionId,
          rating: this.reviewRating,
          note: this.reviewNote
        })
        await this.refreshSession()
      } catch (e) {
        this.reviewError = e.response?.data?.error?.message || 'Could not submit review'
      }
    }
  }
}
</script>

<template lang="pug">
.session
  p(v-if="isLoading") Please wait...
  div(v-else-if="session")
    h1 Session Detail
    p Location: {{ session.location }}
    p Date: {{ new Date(session.date).toLocaleDateString() }} at {{ session.hour }}
    p Distance: {{ session.distance }} km
    p Status: {{ session.status && session.status.current }}
    p(v-if="session.description") Description: {{ session.description }}

    div(v-if="session.athlete")
      h3 Athlete
      router-link(:to="`/athletes/${session.athlete._id}`") {{ session.athlete.name }}
      |  — {{ session.athlete.location }}
    div(v-if="session.guide")
      h3 Guide
      router-link(:to="`/guides/${session.guide._id}`") {{ session.guide.name }}
      |  — {{ session.guide.location }}

    div(v-if="session.guideRating || session.athleteRating")
      h2 Reviews
      p(v-if="session.guideRating") Guide rated: {{ session.guideRating }}/5 — {{ session.guideReview }}
      p(v-if="session.athleteRating") Athlete rated: {{ session.athleteRating }}/5 — {{ session.athleteReview }}

    div(v-if="canApply && user")
      h2 Apply
      p.error(v-if="applyError") {{ applyError }}
      button(@click="handleApply") Apply to this session

    div(v-if="isOwner && allowedStatusTransitions.length")
      h2 Update Status
      p.error(v-if="statusError") {{ statusError }}
      button(
        v-for="status in allowedStatusTransitions"
        :key="status"
        @click="handleStatusChange(status)"
      ) Mark as {{ status }}

    div(v-if="canReview")
      h2 Leave a Review
      p.error(v-if="reviewError") {{ reviewError }}
      form(@submit.prevent="handleReview")
        div
          label Rating (1-5):&nbsp;
          input(type="number" v-model.number="reviewRating" min="1" max="5" required)
        div
          label Note:&nbsp;
          textarea(v-model="reviewNote")
        button(type="submit") Submit Review
</template>
