<template>
  <HeaderPage :isLoggedIn="isLoggedIn" @loggin="loggin"/>
  <div id="app">
    <router-view :isLoggedIn="isLoggedIn" @loggin="loggin"/>
  </div>

</template>
<script>
import HeaderPage from "@/components/HeaderPage.vue";

export default {
  components: {
    HeaderPage
  },
  name: 'App',
  data() {
    return {
      isLoggedIn: false
    }
  },
  methods: {
    loggin(bool){
      this.isLoggedIn = bool;
    }
  },
  mounted() {
    this.isLoggedIn = Boolean(localStorage.getItem('token')) || false;
  }
}
</script>

<style>
#app {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.sub-btn {
  padding: 7px;
  background-color: transparent;
  cursor: pointer;
  color: #1c3b65;
  text-decoration: underline;
}

.sub-btn:hover {
  background-color: #d6e6ff;
}

button {
  margin: 15px 5px;
}
</style>
