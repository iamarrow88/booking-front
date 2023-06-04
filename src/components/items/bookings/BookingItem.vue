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
        <div class="user__name">
          <div class="user__name-title">Пользователь:</div>
          <div class="user__name-value">{{ item.user.first_name + " " + item.user.surname + " " + item.user.middle_name }}</div>
        </div>

        <div class="user__phone">
          <div class="user__phone-title">Телефон: </div>
          <div class="user__phone-value">{{ item.user.phone }} </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import {bookings} from "@/data-and-functions/constants/URLS";

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
          headers: {
            'Content-Type': 'application/json',
            'Accept': '*',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
        }
      ];
      console.log(deleteL);
      const res = await fetch(bookings.deleteBookingByID.URL+this.item.id, {
        method: bookings.deleteBookingByID.METHOD,
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
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
  position: relative;
  display: grid;
  gap: 0.5em;
  align-items: start;
}

.button > button.cards-btn {
  margin-top: -24px;
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

.user__name, .user__phone {
  display: flex;
  justify-content: flex-start;
}
.user__name-title, .user__phone-title {
  font-weight: 900;
  margin-right: 5px;
}

.user__name-value,.user__phone-value {
  text-align: left;
}

@media (max-width: 1165px) {
  .my-booking-item {
    display: grid;
    grid-template-columns: 1fr 4fr;
  }

  .my-booking-item__block {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }

  .my-booking-item__user {
    padding-left: 0;
  }

  .my-booking-item__body {
    display: flex;
    flex-direction: column;
    gap: 0.5em;
  }

  .body__term {
    display: flex;
    justify-content: flex-start;
    gap: 1em;
  }

  .button {
    align-self: end;
    position: absolute;
    top: 0;
    transform: translateY(50%);
  }

  .button > button {
    margin-top: 0;
    width: 9em;
    padding: 10px;
  }
}

@media (max-width: 976px) {
  .body__term {
    flex-direction: column;
    justify-content: flex-start;
    gap: 0.5em;
  }
}

@media (max-width: 682px) {
  .my-booking-item {
    display: flex;
    flex-direction: column;
    gap: 1.5em;
  }
}

@media (max-width: 487px) {
  .my-booking-item {
    align-items: center;
  }

  .my-booking-item__id {
    text-align: center;
  }

  .button {
    margin: 20px 0 0 0;
    position: static;
    align-self: center;
    transform: none;
  }
}


</style>
