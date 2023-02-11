<template>
  <header>
    <div class="header-container">
      <nav class="header-nav">
        <ul class="header-nav-list">
          <li v-if="!isLoggedIn">
            <button @click="showLoginModal">Login</button>
          </li>
          <li v-if="isLoggedIn">
            {{ surname }}
            <button @click="logout">Logout</button>
          </li>
        </ul>
      </nav>
    </div>
  </header>
  <div id="app">
    <router-view/>
  </div>

</template>
<script>
import LoginPage from "@/components/LoginPage.vue";

export default {
  name: 'App',
  data() {
    return {
      isLoggedIn: false,
      surname: null
    }
  },
  methods: {
    showLoginModal() {
      this.$router.push({path: '/login', component: LoginPage})
    },

    logout() {
      this.isLoggedIn = false
      this.surname = null
      localStorage.removeItem("token");
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
