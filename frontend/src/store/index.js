import { createStore } from 'vuex'
import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:3000'

const savedToken = localStorage.getItem('token')
if (savedToken) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`
}

const Mutations = {
  SET_TOKEN: 'SET_TOKEN',
  SET_USER: 'SET_USER',
  SET_ATHLETES: 'SET_ATHLETES',
  SET_GUIDES: 'SET_GUIDES',
  SET_SESSIONS: 'SET_SESSIONS',
  LOGOUT: 'LOGOUT'
}

export default createStore({
  state: {
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    userType: localStorage.getItem('userType') || null,
    athletes: [],
    guides: [],
    sessions: []
  },

  mutations: {
    [Mutations.SET_TOKEN] (state, token) {
      state.token = token
      localStorage.setItem('token', token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    },
    [Mutations.SET_USER] (state, { user, userType }) {
      state.user = user
      state.userType = userType
      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('userType', userType)
    },
    [Mutations.SET_ATHLETES] (state, athletes) {
      state.athletes = athletes
    },
    [Mutations.SET_GUIDES] (state, guides) {
      state.guides = guides
    },
    [Mutations.SET_SESSIONS] (state, sessions) {
      state.sessions = sessions
    },
    [Mutations.LOGOUT] (state) {
      state.token = null
      state.user = null
      state.userType = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('userType')
      delete axios.defaults.headers.common['Authorization']
    }
  },

  actions: {
    async loginAthlete ({ commit }, { email, password }) {
      const res = await axios.post('/athletes/login', { email, password })
      commit(Mutations.SET_TOKEN, res.data.token)
      commit(Mutations.SET_USER, { user: res.data.user, userType: 'athlete' })
      return res.data
    },
    async loginGuide ({ commit }, { email, password }) {
      const res = await axios.post('/guides/login', { email, password })
      commit(Mutations.SET_TOKEN, res.data.token)
      commit(Mutations.SET_USER, { user: res.data.user, userType: 'guide' })
      return res.data
    },
    async registerAthlete (_, data) {
      const res = await axios.post('/athletes', data)
      return res.data
    },
    async registerGuide (_, data) {
      const res = await axios.post('/guides', data)
      return res.data
    },
    logout ({ commit }) {
      commit(Mutations.LOGOUT)
    },

    async fetchAthletes ({ commit }) {
      const res = await axios.get('/athletes')
      commit(Mutations.SET_ATHLETES, res.data)
    },
    async fetchAthlete (_, athleteId) {
      const res = await axios.get(`/athletes/${athleteId}`)
      return res.data
    },

    async fetchGuides ({ commit }) {
      const res = await axios.get('/guides')
      commit(Mutations.SET_GUIDES, res.data)
    },
    async fetchGuide (_, guideId) {
      const res = await axios.get(`/guides/${guideId}`)
      return res.data
    },

    async fetchSessions ({ commit }) {
      const res = await axios.get('/sessions/search')
      commit(Mutations.SET_SESSIONS, res.data)
    },
    async fetchSession (_, sessionId) {
      const res = await axios.get(`/sessions/${sessionId}`)
      return res.data
    },
    async createSession (_, data) {
      const res = await axios.post('/sessions', data)
      return res.data
    },
    async applyToSession (_, sessionId) {
      const res = await axios.patch(`/sessions/${sessionId}/apply`)
      return res.data
    },
    async updateSessionStatus (_, { sessionId, status }) {
      const res = await axios.patch(`/sessions/${sessionId}/status`, { status })
      return res.data
    },
    async reviewSession (_, { sessionId, rating, note }) {
      const res = await axios.patch(`/sessions/${sessionId}/review`, { rating, note })
      return res.data
    },
    async fetchMySessions ({ state }) {
      const { user, userType } = state
      if (!user) return []
      const endpoint = userType === 'athlete'
        ? `/athletes/${user._id}/sessions`
        : `/guides/${user._id}/sessions`
      const res = await axios.get(endpoint)
      return res.data
    }
  }
})
