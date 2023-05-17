<template>
  <div class="my-booking-item">
    <div class="my-booking-item__id">
      <b>ID бронирования:</b> {{ item.id }}
    </div>
    <div class="my-booking-item__block">
      <div class="my-booking-item__resort"><b>Курорт:</b> {{ item.resort.name }}</div>
      <div class="my-booking-item__body">
        <p><b>Тип инвентаря:</b> {{ getInvTypeName }}</p>
        <div class="body__term">
          <p><b>Начало:</b> {{ startTimeFormatted }}</p>
          <p><b>Конец:</b> {{ endTimeFormatted }}</p>
        </div>
        <p><b>Полная стоимость:</b> {{ item.total_price }} RUB</p>

      </div>
      <div v-if="isUserBookingsPage">
        <button  class="btn cards-btn" @click="deleteBooking">Отменить бронирование</button>
      </div>
      <div class="my-booking-item__user" v-else>
        <div class="body__term">
          <p><b>Пользователь:</b> {{ item.user.first_name + " " + item.user.surname + " " + item.user.middle_name }}</p>
          <p><b>Телефон: </b>{{ item.user.phone }} </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import {bookings, headerWithToken} from "@/data-and-functions/constants/URLS";

export default {
  name: "BookingItem",
  props: {
    item: {
      id: Number,
      user_id: Number,
      inventory_id: Number,
      inventory: Object,
      resort: Object,
      total_price: Number,
      start_time: String,
      end_time: String
    },
    page: String,
    isUserBookingsPage: Boolean,
  },
  data() {
    return {
      startTimeFormatted: '',
      endTimeFormatted: '',
      res: {},
    }
  },

  methods: {
    ...mapActions(['fetchInventoryTypes']),
    formatTime(originTime) {
      let arrDate = originTime.split('-');
      let arrTime = arrDate[2].split(':');
      let day = arrDate[2].slice(0, 2);
      arrDate = arrDate.reverse();
      arrDate[0] = day;
      let date = arrDate.join('.')
      let hour = arrTime[0].slice(3, 5);
      let time = hour + ':00';
      return [date, time];
    },
    async deleteBooking(){
      const deleteL = [
        bookings.deleteBookingByID.URL+this.item.id, {
          method: bookings.deleteBookingByID.METHOD,
          headers: headerWithToken,
        }
      ];
      console.log(deleteL);
      const res = await fetch(bookings.deleteBookingByID.URL+this.item.id, {
        method: bookings.deleteBookingByID.METHOD,
        headers: headerWithToken
      })
      this.res = await res;
      if(res.ok){
        console.log('удалено');
      } else {
        console.log('не удалено');
      }
    }
  },
  computed: {
    ...mapGetters(['IS_USER_OWNER', 'GET_INVENTORY_TYPES']),
    getInvTypeName() {
      let typeName = '';
      this.GET_INVENTORY_TYPES.forEach(type => {
        if (type.id === this.item.inventory.type_id) typeName = type.name;
      })
      return typeName;
    },
  },
  async mounted() {
    if(this.GET_INVENTORY_TYPES.length === 0) await this.fetchInventoryTypes();
    this.startTimeFormatted = this.formatTime(this.item.start_time).join(' ');
    this.endTimeFormatted = this.formatTime(this.item.end_time).join(' ');
  }
}
</script>

<style scoped>

.my-booking-item {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

.my-booking-item__block {
  display: grid;
  grid-template-columns: 2fr 5fr 1fr;
  gap: 0.5em;
  align-items: start;
}

.my-booking-item__user {
  margin: 0;
}
.my-booking-item__user > p{
  margin: 0;
}

</style>
