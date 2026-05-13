<template lang="pug">
div#app
  nav#nav
    template(v-if="token")
      router-link(to="/sessions") Sessions
      |  |
      router-link(to="/athletes") Athletes
      |  |
      router-link(to="/guides") Guides
      |  |
      router-link(to="/dashboard") Dashboard
      |  |
      a.logout(@click.prevent="handleLogout" href="#") Logout ({{ user && user.name }})
    template(v-else)
      router-link(to="/login") Login
      |  |
      router-link(to="/register") Register
  router-view
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'App',
  computed: {
    ...mapState(['token', 'user', 'userType'])
  },
  methods: {
    ...mapActions(['logout']),
    handleLogout () {
      this.logout()
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;
    cursor: pointer;
    text-decoration: none;

    &.router-link-exact-active {
      color: #42b983;
    }

    &.logout {
      color: #e74c3c;
    }
  }
}

.error {
  color: #e74c3c;
}
</style>
