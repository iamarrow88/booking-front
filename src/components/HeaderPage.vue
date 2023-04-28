<template>
  <header>
    <div class="header-container">
      <nav class="header-nav">
        <div>
          <div @click="goToHomePage" class="logo">
            <img class="logo-img" src="../assets/logo1.png" alt="logo">
            <div class="logo-title">Домашняя страница</div>
          </div>
        </div>
        <div class="user-block">
          <div v-if="isLoggedIn" class="header-management">
            <button @click="goToMyBooking">Мои бронирования</button>
            <button v-if="isOwner" @click="goToResortBookings">Бронирования курорта</button>
            <button v-if="isOwner" @click="goToResortManagingPage">Управление курортом</button>
          </div>
          <div class="profile">
            <div v-if="isLoggedIn" class="profile-img" @click="isHoverOnProfileIcon=!isHoverOnProfileIcon">
              <img class="avatar" v-if="!isOwner" src="../assets/user.png" alt="avatar"><br>
              <img class="avatar" v-if="isOwner" src="../assets/admin.png" alt="avatar"><br>
              <div class="profile-username">{{ surname }}</div>
            </div>
            <div class="profile-actions">
              <button @click="showLoginModal" v-if="!isLoggedIn">Войти</button>
              <transition name="fade">
                <div class="profile-auth" v-if="isHoverOnProfileIcon">
                  <button @click="goToProfile" v-if="isLoggedIn">В профиль</button>
                  <button @click="logout" v-if="isLoggedIn">Выйти</button>
                </div>
              </transition>
            </div>
          </div>
        </div>
      </nav>
    </div>
  </header>
</template>

<script>
import LoginPage from "@/components/LoginPage.vue";
import validationMixins from "@/components/mixins/validationMixins";
import {mapMutations} from "vuex";

export default {
  name: "HeaderPage",
  mixins: [validationMixins],
  data() {
    return {
      isHoverOnProfileIcon: false,
    }
  },
  methods: {
    ...mapMutations(['login']),
    showLoginModal() {
      this.$router.push({path: '/login', component: LoginPage})
    },
    logout() {
      this.login(false);
      this.$router.push('/login');
    },

    goToHomePage() {
      this.$router.push('/');
    },
    goToMyBooking() {
      this.$router.push("/mybooking");
    },
    goToResortBookings() {
      this.$router.push({path: '/resorts/bookings'})
    },
    goToResortManagingPage() {
      this.$router.push({path: '/resorts/manage'})
    },
    goToProfile() {
      this.$router.push({path: '/profile'})
    }
  },
  mounted() {
    if(localStorage.getItem('token')) {
      this.login();
      this.surname = localStorage.getItem('surname');//*//
    } else {
      this.login(false);
    }

    this.$store.dispatch('fetchInventoryTypes');

  },
  computed: {
    isLoggedIn(){
      return this.$store.state.authorization.isLoggedIn;
    },
    isOwner(){
      return this.$store.state.authorization.isOwner;
    },
    surname(){
      return this.$store.state.authorization.user.surname;
    }
  },
}
</script>

<style scoped>
.header-container {
  color: #000;
  padding: 20px 80px;
}

.header-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo{
  max-width: 180px;
  cursor: pointer;
}

.logo-img {
  max-width: 100%;
}

.logo-title {
  font-size: 24px;
}

.user-block {
  display: flex;
  align-items: center;
  gap: 50px
}

.header-management {
  display: flex;
  gap: 20px;
}

.profile-username {
  margin: 0;
  padding: 2px 4px;
  border: 2px solid green;
  border-radius: 5px;
  cursor: pointer;
}

.avatar {
  width: 90px;
}

.profile {
  display: flex;
}

.profile-auth {
  display: flex;
  flex-direction: column;
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




.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transition: opacity 0.5s ease;
}
</style>
