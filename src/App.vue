<template>
  <HeaderPage :isLoggedIn="isLoggedIn"/>
  <div id="app">
    <router-view/>
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
  mounted() {
    this.isLoggedIn = Boolean(localStorage.getItem('token')) || false;
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
