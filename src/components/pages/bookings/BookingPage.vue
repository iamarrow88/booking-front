<template>
  <div v-if="isLoggedIn" class="my-booking">
    <h3 class="my-booking__title">Мои бронирования:</h3>
    <booking-item v-for="item in bookings"
                  :key="item.id"
                  :item="item"
                  :inventoryTypes="inv_types"
    :isUserBookingsPage="isUserBookingsPage">
    </booking-item>
  </div>
</template>

<script>

import BookingItem from "@/components/items/bookings/BookingItem.vue";
import {mapActions, mapGetters} from "vuex";

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
      ...mapGetters(['GET_ALL_USER_INFO']),
      isUserBookingsPage: null,
    }
  },
  methods: mapActions(['fetchInventoryTypes', 'fetchCities']),
  async mounted() {
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
        this.booking = await res.json()
      }
    } catch (err) {
      console.error(err);
    }
    await this.fetchInventoryTypes();
    await this.fetchCities();
    this.isUserBookingsPage = !!this.$route.fullPath.split('/').includes('user');
  }

}
</script>
<style>

</style>

