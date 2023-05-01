<template>
  <div class="my-booking">
    <h3 class="my-booking__title">Все бронирования:</h3>

    <booking-item v-for="item in booking"
                  :key="item.id"
                  :item="item"
                  :inventoryTypes="inv_types"></booking-item>

  </div>
</template>

<script>
import BookingItem from "@/components/BookingItem.vue";

export default {
  components: {BookingItem},
  data() {
    return {
      booking: [],
      inv_types: [],
    }
  },
  async mounted() {
    try {
      const res = await fetch('/api/resorts/bookings', {
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
    try {
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
        this.inv_types = await res.json();

      }
    } catch (err) {
      console.error(err);
    }


  }
}
</script>
<style>

</style>