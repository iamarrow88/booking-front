<template>
  <div class="my-booking">
    <h3 class="my-booking__title">Все бронирования:</h3>

    <div class="my-booking__select select">
      <label for="selectResort" class="select__resort-name">Курорт:</label>
      <select name="startTime"
              id="startTime"
              v-model="selectedResortName"
              class="select__select">
        <option v-for="resort in resorts" :key="resort.id"> {{ resort.name }}</option>
      </select>
    </div>

    <div v-if="filteredBookings.length > 0">
      <booking-item v-for="item in filteredBookings"
                    :key="item.id"
                    :item="item"
                    :inventoryTypes="inv_types">
      </booking-item>
    </div>

    <div v-else>
      Бронирований нет
    </div>
  </div>
</template>

<script>
import BookingItem from "@/components/items/bookings/BookingItem.vue";
import {mapActions, mapGetters} from "vuex";

export default {
  components: {BookingItem},
  props: {
    isLoggedIn: Boolean,
  },
  data() {
    return {
      resorts: [],
      bookings: [],
      selectedResortName: '',
      selectedResort: {},
      inv_types: [],
      ...mapGetters(['GET_ALL_USER_INFO'])
    }
  },
  watch:{
    selectedResortName(){
      this.getSelectedResort();
    },
  },
  computed: {
    filteredBookings() {
      return this.bookings.filter(booking => +booking.inventory.resort_id === +this.selectedResort.id)
    }
  },
  methods: {
    ...mapActions(['fetchInventoryTypes', 'fetchCities']),
    async getUserResorts() {
      try {
        const resorts = await fetch('/api/myresorts',
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
              },
            });
        this.resorts = await resorts.json();
      } catch (e) {
        console.error(e);
      }
    },
    getSelectedResort() {
      this.resorts.forEach(resort => {
        if (resort.name === this.selectedResortName) {
          this.selectedResort = resort;
        }
      })
    },
  },

  async mounted() {
    await this.getUserResorts();

    await this.fetchInventoryTypes();
    await this.fetchCities();
    this.selectedResortName = this.resorts[0].name;
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
        this.bookings = await res.json()
      }
    } catch (err) {
      console.error(err);
    }
  }
}
</script>
<style>

.select {
  margin: 0 auto 4em;
  width: 83%;
}

</style>
