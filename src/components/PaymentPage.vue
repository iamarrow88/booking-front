<template>
  <div class="payment">
    <div>Введите номер карты :)</div>

    <button @click="bookingItem">Я ввел, честно</button>
  </div>
</template>

<script>
export default {
  name: "PaymentPage",
  data(){
    return {
      bookings: []
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
            start_time: this.$route.query.sel_date + 'T' + startTime + 'Z',
            end_time: this.$route.query.sel_date + 'T' + endTime + 'Z'
          })
        });
        if(response.ok) {
          this.bookings = await response.json();
          console.log('ok');

        } else {
          console.log('not ok');
        }
      } catch (error) {
        console.error(error)
      }
    }
  },
}
</script>

<style scoped>

</style>