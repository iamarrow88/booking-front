<template>
  <div class="payment" v-if="!isPaymentOk">
    <div>Сумма к оплате </div>
    <div>Введите номер карты :)</div>

    <button @click="bookingItem" class="cards-btn">Я ввел, честно</button>
  </div>
  <div v-else>
    <modal-window :isOpen="isOpen" @closePopUp="closePopUp"></modal-window>
  </div>
</template>

<script>
import ModalWindow from "@/components/ModalWindow.vue";

export default {
  name: "PaymentPage",
  components: ModalWindow,
  data(){
    return {
      bookings: [],
      isPaymentOk: false,
      isOpen: true,
      total: null,
    }
  },
  methods: {
    async bookingItem() {
      const startTime = this.$route.query.startTime + ':00:00';
      const endTime = this.$route.query.endTime + ':00:00';
      try {
        const response = await fetch('/api/booking', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': '*',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          },
          body: JSON.stringify({
            inventory_id: +this.$route.query.itemId,
            start_time: this.$route.query.selDateStartShort + 'T' + startTime + 'Z',
            end_time: this.$route.query.selDateStartShort + 'T' + endTime + 'Z'
          })
        });
        if(response.ok) {
          this.bookings = await response.json();
          console.log('ok');
          this.isPaymentOk = true;

        } else {
          console.log('not ok');
        }
      } catch (error) {
        console.error(error)
      }
    },
    closePopUp(bool1) {
      this.isOpen = bool1;
      this.$router.push('/mybooking')
    }
  },
  created() {
    this.total = this.$route.query.total;
  }
}
</script>

<style scoped>

</style>