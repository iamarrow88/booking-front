<template>
  <header>
    <div class="header-container">
      <nav class="header-nav">
        <div>
          <button @click="goToHomePage">Home</button>
        </div>
        <div class="header-nav-list">
          <div v-if="!isLoggedIn">
            <button @click="showLoginModal">Login</button>
          </div>
          <div v-if="isLoggedIn" class="logout-button-container">
            {{ surname }}
            <button @click="logout">Logout</button>
          </div>
        </div>
      </nav>
    </div>
  </header>
</template>

<script>
import LoginPage from "@/components/LoginPage.vue";

export default {
  name: "HeaderPage",
  data() {
    return {
      surname: null
    }
  },
  computed: {
    isLoggedIn() {
      return localStorage.getItem('token') !== null;
    }
  },
  methods: {
    showLoginModal() {
      this.$router.push({path: '/login', component: LoginPage})
    },

    logout() {
      localStorage.removeItem("token");
      this.$router.go();
    },

    goToHomePage() {
      this.$router.push('/');
    }
  }
}
</script>

<style scoped>
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  background-color: #333;
  color: white;
  padding: 0 20px;
}

.header-nav {
  display: flex;
  align-items: center;
}

.header-nav-list {
  display: flex;
  align-items: center;
  list-style-type: none;
  margin: 0;
  padding: 0;
}

.header-nav-list div {
  margin-left: 10px;
}

button {
  background-color: transparent;
  border: none;
  color: inherit;
  cursor: pointer;
  font-size: 16px;
  padding: 10px;
  text-align: center;
  text-decoration: none;
  transition: background-color 0.3s;
}

button:hover {
  background-color: rgba(255, 255, 255, 0.2);
}
</style>
