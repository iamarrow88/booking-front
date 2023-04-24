<template>
  <div v-if="isLoggedIn" class="my-booking">
    <h3 class="my-booking-title">Мои бронирования:</h3>
    <booking-item v-for="item in booking"
                  :key="item.id"
                  :item="item"
                  :inventoryTypes="inv_types"></booking-item>
  </div>
</template>

<script>

import BookingItem from "@/components/BookingItem.vue";
import {mapActions} from "vuex";

export default {
  components: {BookingItem},
  props: {
    isLoggedIn: Boolean,
  },
  data() {
    return {
      booking: [],
      inv_types: [],
    }
  },
  methods: mapActions(['fetchInventoryTypes']),
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
        console.log(this.booking)
      }
    } catch (err) {
      console.error(err);
    }
    await this.fetchInventoryTypes();
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
    }*/

    /* if(!this.isLoggedIn) {
       this.$router.push('/login');
     }*/


  }
}
</script>
<style>
.my-booking {
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
}

.my-booking-title {
  margin-top: 0;
  font-size: 1.5rem;
  font-weight: bold;
}

.my-booking-item-body p {
  margin: 0;
  font-size: 1.1rem;
}

@media (max-width: 767px) {
  .my-booking-title {
    font-size: 1.25rem;
  }


  .my-booking-item-body p {
    font-size: 0.9rem;
  }
}
</style>