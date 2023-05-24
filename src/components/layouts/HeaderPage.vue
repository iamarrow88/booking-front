<template>
  <header>
    <div class="header-container">
      <nav class="header-nav">
        <div>
          <div @click="goToHomePage" class="logo">
            <img class="logo-img" src="../../assets/logo1.png" alt="logo">
            <div class="logo-title">Домашняя страница</div>
          </div>
        </div>
        <div class="user-block">
          <div v-if="IS_LOGGED_IN" class="header-management">
            <button @click="goToMyBooking">Мои бронирования</button>
            <button v-if="IS_USER_OWNER" @click="goToResortBookings">Бронирования курорта</button>
            <button v-if="IS_USER_OWNER" @click="goToResortManagingPage">Управление курортом</button>
            <button v-if="IS_USER_OWNER" @click="goToResortStatisticsPage">Статистика</button>
          </div>
          <div class="profile">
            <div v-if="IS_LOGGED_IN" class="profile-img" @click="isHoverOnProfileIcon=!isHoverOnProfileIcon">
              <img class="avatar" v-if="!IS_USER_OWNER" src="../../assets/user.png" alt="avatar"><br>
              <img class="avatar" v-if="IS_USER_OWNER" src="../../assets/admin.png" alt="avatar"><br>
              <div class="profile-username">{{ GET_USER_SURNAME }}</div>
            </div>
            <div class="profile-actions">
              <button @click="goToLoginPage" v-if="!IS_LOGGED_IN">Войти</button>
              <transition name="fade">
                <div class="profile-auth" v-if="isHoverOnProfileIcon">
                  <button @click="goToProfile" v-if="IS_LOGGED_IN">В профиль</button>
                  <button @click="logout" v-if="IS_LOGGED_IN">Выйти</button>
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
import {mapGetters, mapMutations} from "vuex";
import paths from "@/data-and-functions/constants/paths.js";
import AuthorizationPage from "@/components/blocks/user/AuthorizationPage.vue";

export default {
  name: "HeaderPage",
  data() {
    return {
      isHoverOnProfileIcon: false,
    }
  },
  computed: {
    ...mapGetters(['GET_USER_SURNAME', 'IS_USER_OWNER', 'IS_LOGGED_IN']),
  },
  methods: {
    ...mapMutations(['login', 'checkLogin']),
    goToLoginPage() {
      this.$router.push({path: paths.LoginPage, component: AuthorizationPage})
    },
    logout() {
      this.$store.commit('logoutUser');
      this.$router.push(paths.LoginPage);
    },
    goToHomePage() {
      this.$router.push(paths.StartPage);
    },
    goToMyBooking() {
      this.$router.push(paths.UserBookingPage);
    },
    goToResortBookings() {
      this.$router.push(paths.ResortBookingsPage);
    },
    goToResortManagingPage() {
      this.$router.push(paths.ManageResort);
    },
    goToProfile() {
      this.$router.push(paths.UserPage);
    },
    goToResortStatisticsPage() {
      this.$router.push(paths.StatisticsPage);
    }
  },
  mounted() {
    this.$store.commit('bringUserDataFromLS');
    this.$store.commit('checkLogin');
    this.$store.dispatch('fetchInventoryTypes');
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

.logo {
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
  text-align: center;
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
