<template>
  <div v-show="isBookingProcessStarted" class="pop-up" @click="closePopUp">
    <div class="pop-up-block">
      <div class="pop-up-text">Вы бронируете <b>{{ typeName }}</b>, стоимость <b>{{ item.price }} RUB</b></div>
      <div class="pop-up-text">На курорте <b>{{ resortName }}</b> с <b>{{ formatStartDate }}</b> по <b>{{ formatEndDate }}</b></div>
      <div class="pop-up-btns">
        <button class="pop-up-btn" @click="bookingItem">Да</button>
        <button class="pop-up-btn" @click="closePopUp">Нет</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PopUp",
  props: {
    isBookingProcessStarted: Boolean,
    typeName: String,
    item: {
      id: Number,
      photo: String,
      price: Number,
      resort_id: Number,
      type_id: Number
    },
    resortName: String,
    startDate: String,
    duration: Number
  },
  data() {
    return {
      bookings: [],
      endDate: null,
      formatStartDate: null,
      formatEndDate: null
    }
  },
  methods: {
    closePopUp() {
      this.$props.isBookingProcessStarted = false;
      this.$emit('closePopUp', false)
    },
    getEndDate() {
      console.log('getEndDate')
      let formatDate = new Date(this.startDate);
      let endDate = formatDate;
      endDate.setDate(formatDate.getDate() + +this.duration)
      this.endDate = endDate.toISOString().slice(0, 10);
      return this.endDate;
    },
    formatDate() {
      console.log('formatDate')
      this.formatStartDate = new Date(this.startDate).toLocaleDateString();
      this.formatEndDate = new Date(this.endDate).toLocaleDateString();

    },
    async bookingItem() {
      try {
        const response = await fetch('/api/booking', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': '*'
          },
          body: JSON.stringify({
            inventory_id: this.$props.item.id,
            start_date: this.$props.startDate,
            duration: this.$props.duration,
          })
        });
        this.bookings = await response.json();
      } catch (error) {
        console.error(error)
      }
    }
  },
  created() {
    console.log('created')
    this.getEndDate();
    this.formatDate();
  }
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
    width: 50%;
  }
</style>