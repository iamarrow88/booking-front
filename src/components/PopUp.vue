<template>
  <div v-show="isBookingProcessStarted"
       class="pop-up"
       @click="closePopUp">
    <div class="pop-up__block">
      <div class="pop-up__text">Вы бронируете <b>{{ typeName }}</b>, стоимость <b>{{ item.price }} RUB</b></div>
      <div class="pop-up__text">На курорте <b>{{ resortName }}</b></div>
      <div class="pop-up__text">Когда: с <b>{{ formattedStartDate }} {{ startTime }}:00</b> по <b>{{formattedEndDate}} {{ endTime }}:00</b></div>
      <div class="pop-up__text">Стоимость: <b>{{ total }} RUB</b></div>
      <div class="pop-up__btns">
        <button class="pop-up__btn cards-btn" @click="goPaymentPage">Оплатить</button>
        <button class="pop-up__btn cards-btn" @click="closePopUp">Отмена</button>
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
  bottom: 0;
  right: 0;
  background-color: rgba(178, 178, 178, .3);
  z-index: 10;
}

.pop-up__block {
  position: absolute;
  top: 46%;
  left: 35%;
  padding: 25px;
  background-color: #fff;
}

.pop-up__text {
  margin-bottom: 15px;
}

.pop-up__btns {
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  width: 80%;
}
</style>