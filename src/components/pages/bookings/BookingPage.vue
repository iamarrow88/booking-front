<template>
  <div v-if="isLoggedIn" class="my-booking">
    <h3 class="my-booking__title">Мои бронирования:</h3>

    <div v-if="bookings.length > 0">
      <booking-item v-for="item in bookings"
                    :key="item.id"
                    :item="item"
                    :inventoryTypes="inv_types"
      :isUserBookingsPage="isUserBookingsPage">
      </booking-item>
    </div>

    <div v-else>
      <p class="info">Бронирований нет</p>
      <button class="cards-btn action" @click="goToStartPage">Забронировать инвентарь</button>
    </div>
  </div>
</template>

<script>

import BookingItem from "@/components/items/bookings/BookingItem.vue";
import {mapActions, mapGetters} from "vuex";
import paths from "@/data-and-functions/constants/paths";

export default {
  name: "BookingPage",
  components: {BookingItem},
  props: {
    isLoggedIn: Boolean,
  },
  data() {
    return {
      bookings: [],
      inv_types: [],
      isUserBookingsPage: null,
    }
  },
  computed: {
    ...mapGetters(['GET_ALL_USER_INFO']),
  },
  methods: {
    ...mapActions(['fetchInventoryTypes', 'fetchCities']),
    goToStartPage() {
      this.$router.push(paths.StartPage);
    }
  },
  async mounted() {
    await this.fetchInventoryTypes();
    await this.fetchCities();
    this.isUserBookingsPage = !!this.$route.fullPath.split('/').includes('user');
    try {
      const res = await fetch('/api/user/bookings', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
      });

      if (!res.ok) {
        this.errorMessage = "Invalid data provided, please try again";
      } else {
        this.bookings = await res.json()
      }
    } catch (err) {
      console.error(err);
    }

  }

}
</script>
<style>

.info {
  margin-bottom: 2em;
}

.cards-btn {
  width: 50%;
  margin: 0 auto;
}

</style>

