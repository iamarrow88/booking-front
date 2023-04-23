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
      isLoggedIn: false,
    }
  },
  methods: {
    loggin(bool){
      this.isLoggedIn = bool;
    },
  },
  mounted() {
    this.isLoggedIn = Boolean(localStorage.getItem('token')) || false;
  }
}
</script>

<style>

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=Raleway:wght@400;500;700&family=Roboto:wght@400;500;700;900&display=swap');
#app {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Roboto', sans-serif;
  /*font-family: Avenir, Helvetica, Arial, sans-serif;*/
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

</style>
