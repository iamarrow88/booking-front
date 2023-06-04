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
    },
    ...mapGetters(['GET_ALL_USER_INFO']),
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
    goToStartPage() {
      this.$router.push(paths.StartPage);
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

.info {
  margin-bottom: 2em;
}

.cards-btn {
  width: 50%;
  margin: 0 auto;
}

</style>
