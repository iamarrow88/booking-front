<template>
  <header>
    <div class="header-container">
      <nav class="header-nav">
        <div>
          <button @click="goToHomePage">Домашняя страница</button>
        </div>
        <div class="header-nav-list">
          <div v-if="!isLoggedIn">
            <button @click="showLoginModal">Войти</button>
          </div>
          <div v-if="isLoggedIn" class="logout-button-container">
            {{ surname }} // изменить
            <button @click="goToMyBooking">Мои бронирования</button>
            <button v-if="isOwner" @click="goToResortBookings">Бронирования курорта</button>
            <button v-if="isOwner" @click="goToResortManagingPage">Управление курортом</button>
            <button @click="logout">Выйти</button>

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
  props: {
    isLoggedIn: Boolean,
  },
  data() {
    return {
      surname: null,
    }
  },
  mounted() {
    this.surname = localStorage.getItem('surname');
  },
  computed: {
    isOwner() {
      return localStorage.getItem('role_id') === 3 || localStorage.getItem('role_id') === '3';
    }
  },
  methods: {
    showLoginModal() {
      this.$router.push({path: '/login', component: LoginPage})
    },

    logout() {
      localStorage.removeItem("token");
      this.$emit('loggin', false);
      this.$router.push('/login');
    },

    goToHomePage() {
      this.$router.push('/');
    },
    goToMyBooking() {
      this.$router.push("/mybooking"); // navigate to "/mybooking" route
    },
    goToResortBookings() {
      this.$router.push({path: '/resorts/bookings'})
    },
    goToResortManagingPage() {
      this.$router.push({path: '/resorts/manage'})
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
