<template>
  <div class="my-booking-item">
    <div class="my-booking-item__id">
      <b>ID бронирования:</b> {{ item.id }}
    </div>
    <div class="my-booking-item__block" :class="{gridForUser: gridForUser, gridForResort: !gridForUser}">
      <div class="my-booking-item__resort"><b>Курорт:</b> {{ item.resort.name }}</div>
      <div class="my-booking-item__body">
        <div><b>Тип инвентаря:</b> {{ getInvTypeName }}</div>
        <div class="body__term">
          <p><b>Начало:</b> {{ startTimeFormatted }}</p>
          <p><b>Конец:</b> {{ endTimeFormatted }}</p>
        </div>
        <div><b>Полная стоимость:</b> {{ item.total_price }} RUB</div>

      </div>
      <div v-if="isUserBookingsPage" class="button">
        <button  class="btn cards-btn" @click="deleteBooking">Отменить бронирование</button>
      </div>
      <div class="my-booking-item__user" v-else>
        <div><b>Пользователь:</b> {{ item.user.first_name + " " + item.user.surname + " " + item.user.middle_name }}</div>
        <div><b>Телефон: </b>{{ item.user.phone }} </div>
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
      gridForUser: null,
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
  created() {
    this.gridForUser = !!this.$route.fullPath.split('/').includes('user');
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
  gap: 0.5em;
  align-items: start;
}

.button > button.cards-btn {
  height: auto;
}

.my-booking-item__body {
  display: grid;
  grid-template-columns: 2fr 5fr 2fr;
}

.my-booking-item__body > div {
  text-align: left;
}

.my-booking-item__user {
  margin: 0;
  padding-left: 1em;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.3em;
}

.gridForUser {
  grid-template-columns: 2fr 5fr 1fr;
}

.gridForResort {
  grid-template-columns: 1.5fr 3.5fr 2fr;
}

</style>
