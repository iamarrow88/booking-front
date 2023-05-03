<template>
  <div v-if="isLoggedIn" class="my-booking">
    <h3 class="my-booking__title">Мои бронирования:</h3>
    <booking-item v-for="item in booking"
                  :key="item.id"
                  :item="item"
                  :inventoryTypes="inv_types"></booking-item>
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
      booking: [],
      inv_types: [],
      ...mapGetters(['GET_ALL_USER_INFO'])
    }
  },
  methods: mapActions(['fetchInventoryTypes', 'fetchCities']),
  async mounted() {
    console.log(this.$store.getters.GET_ALL_USER_INFO);
    const token = localStorage.getItem('token');
    console.log('token ' + token);
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
    /*try {
      const res = await fetch('/api/inventories/types', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
      });

      if (!res.ok) {
        this.errorMessage = "Invalid data provided, please try again";
      } else {
        this.inv_types = await res.json()
        console.log(this.inv_types)
      }
    } catch (err) {
      console.error(err);
    }

    /* if(!this.isLoggedIn) {
       this.$router.push('/login');
     }*/


  }
}
</script>
<style>

</style>