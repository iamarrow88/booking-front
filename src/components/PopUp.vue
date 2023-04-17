<template>
  <div v-show="isBookingProcessStarted" class="pop-up" @click="closePopUp">
    <div class="pop-up-block">
      <div class="pop-up-text">Вы бронируете <b>{{ typeName }}</b>, стоимость <b>{{ item.price }} RUB</b></div>
      <div class="pop-up-text">На курорте <b>{{ resortName }}</b></div>
      <div class="pop-up-text">Когда: с <b>{{ formattedStartDate }} {{ startTime }}:00</b> по <b>{{formattedEndDate}} {{ endTime }}:00</b></div>
      <div class="pop-up-text">Стоимость: <b>{{ total }} RUB</b></div>
      <div class="pop-up-btns">
        <button class="pop-up-btn" @click="goPaymentPage">Оплатить</button>
        <button class="pop-up-btn" @click="closePopUp">Отмена</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PopUp",
  props: {
    item: {
      id: Number,
      photo: String,
      price: Number,
      resort_id: Number,
      type_id: Number
    },
    typeName: String,
    isBookingProcessStarted: Boolean,
    resortName: String,
    selDateStartShort: String,
    selDateEndShort: String,
    startTime: String,
    endTime: String,
    total: Number
  },
  data() {
    return {
      bookings: [],
      endDate: null,
      isBooked: false,
    }
  },
  methods: {
    closePopUp() {
      this.$props.isBookingProcessStarted = false;
      this.$emit('closePopUp', false, this.isBooked)
    },
    formatDate(date){
      let arr = date.split('-');
      return arr.reverse().join('.');
    },

    async goPaymentPage() {
      this.$router.push({path: '/payment', query: {
          selDateStartShort: this.selDateStartShort,
          startTime: this.startTime,
          endTime: this.endTime,
          itemId: this.item.id,
          total: this.total
        }});
    }
  },
  computed: {
    formattedStartDate() {
      return this.formatDate(this.selDateStartShort);
    },
    formattedEndDate(){
      return this.formatDate(this.selDateEndShort);
    }
  },
}
</script>

<style scoped>
.pop-up {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(178, 178, 178, .3);
  z-index: 10;
}

.pop-up-block {
  position: absolute;
  top: 46%;
  left: 35%;
  padding: 25px;
  background-color: #fff;
}

.pop-up-text {
  margin-bottom: 15px;
}

.pop-up-btns {
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  width: 80%;
}
</style>