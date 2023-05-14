<template>
  <div v-show="isBookingProcessStarted"
       class="pop-up"
       @click="closePopUp">
    <div class="pop-up__block" v-if="IS_LOGGED_IN">
      <div class="pop-up__text">Вы бронируете <b>{{ typeName }}</b>, стоимостью <b>{{ item.price }} RUB в час</b></div>
      <div class="pop-up__text">На курорте <b>{{ resortName }}</b></div>
      <div class="pop-up__text">Когда: с <b>{{ formattedStartDate }} {{ startTime }}:00</b> по <b>{{ formattedEndDate }}
        {{ endTime }}:00</b></div>
      <div class="pop-up__text">Итоговая стоимость: <b>{{ total }} RUB</b></div>
      <div class="pop-up__btns">
        <button class="pop-up__btn cards-btn action" @click="goPaymentPage">Оплатить</button>
        <button class="pop-up__btn cards-btn" @click="closePopUp">Отмена</button>
      </div>
    </div>
    <information-window v-else @Back="closePopUp"
    @GoToAuthPage="GoToAuthPage"></information-window>
  </div>
</template>

<script>
import InformationWindow from "@/components/blocks/modal/InformationWindow.vue";
import paths from "@/data-and-functions/constants/paths";
import {mapGetters, mapMutations} from "vuex";

export default {
  name: "ConfirmWindow",
  components: InformationWindow,
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
    total: Number,
    duration: Number
  },
  data() {
    return {
      bookings: [],
      endDate: null,
      isBooked: false,
    }
  },
  computed: {
    formattedStartDate() {
      return this.formatDate(this.selDateStartShort);
    },
    formattedEndDate() {
      return this.formatDate(this.selDateEndShort);
    },
    ...mapGetters(['IS_LOGGED_IN', 'GET_SAVED_DATA'])
  },
  methods: {
    ...mapMutations(['updateSavedData']),
    closePopUp() {
      this.$emit('closePopUp', false, this.isBooked)
    },
    formatDate(date) {
      let arr = date.split('-');
      return arr.reverse().join('.');
    },
    GoToAuthPage(){
      console.log('go to auth page');
      console.log(this.item);
      const saved = {
        item: this.item,
        resort: this.resort,
        startDateShort: this.selDateStartShort,
        endDateShort: this.selDateEndShort,
        startTime: this.startTime,
        endTime: this.endTime,
        duration: this.duration,
        totalPrice: this.total,
      }
      this.updateSavedData(saved);
      this.$router.push({ path: paths.LoginPage, query: { toPayment: true} });
    },
    async goPaymentPage() {
      this.$router.push({
        path: '/payment', query: {
          selDateStartShort: this.selDateStartShort,
          startTime: this.startTime,
          endTime: this.endTime,
          itemId: this.item.id,
          total: this.total
        }
      });
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

</style>
