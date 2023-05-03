<template>
  <div class="container" v-if="!IS_LOGGED_IN">
    <h1 class="title">Вход/Регистрация</h1>
    <div v-if="isLoginChecked">
      <login-block @entryBlockToggle="entryBlockToggle"></login-block>
    </div>
    <div v-else>
      <registration-block @entryBlockToggle="entryBlockToggle"></registration-block>
    </div>
  </div>
  <div v-else>
    <h3 class="subtitle">Здравствуйте, {{ GET_USER_SURNAME }}</h3>

    <button class="sub-btn" @click="goToStartPage">Забронировать чего-нибудь</button>
    <button class="sub-btn" @click="goToMyBookingsPage">Посмотреть, чего уже набронировал</button>
    <button class="sub-btn" @click="goToResortPage" v-if="IS_USER_OWNER">Поуправлять курортом xD</button>
    <button class="btn btn-primary cards-btn"
            @click="logout">Выйти из аккаунта</button>
  </div>
</template>

<script>

import {mapGetters} from "vuex";
import paths from "@/data-and-functions/constants/paths";

export default {
  name: "AuthorizationPage",
  components: ['LoginBlock', 'RegistrationBlock'],
  data(){
    return {
      isLoginChecked: true,
    }
  },
  computed: {
    ...mapGetters(['IS_LOGGED_IN', 'GET_USER_SURNAME', 'IS_USER_OWNER']),
  },
  methods: {
    entryBlockToggle(boolean){
      this.isLoginChecked = boolean;
    },
    logout() {
      this.$store.commit('logoutUser');
    },
    goToStartPage(){
      this.$router.push({path: paths.StartPage});
    },
    goToMyBookingsPage(){
      this.$router.push({path: paths.UserBookingPage});
    },
    goToResortPage(){
      this.$router.push({path: paths.ManageResort});
    }
  }
}
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 0 20px;
}

.form-group {
  margin-bottom: 25px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-size: 18px;
}

input[type="text"],
input[type="email"],
input[type="password"],
select {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #d8d8d8;
  transition: border-color 0.2s ease-in-out;
}

input[type="text"]:focus,
input[type="email"]:focus,
input[type="password"]:focus,
select:focus {
  outline: none;
  border-color: #007bff;
}

button {
  display: inline-block;
  padding: 12px 25px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 5px;
  background-color: #007bff;
  color: #fff;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
}

button:hover {
  background-color: #0069d9;
}

.error-message {
  color: #dc3545;
  font-size: 16px;
  margin-top: 10px;
}

.title {
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 20px;
}

.subtitle {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 15px;
}

</style>