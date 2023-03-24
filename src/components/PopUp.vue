<template>
  <div v-show="isBookingProcessStarted" class="pop-up" @click="closePopUp">
    <div class="pop-up-block">
      <div class="pop-up-text">Вы бронируете <b>{{ typeName }}</b>, стоимость <b>{{ item.price }} RUB</b></div>
      <div class="pop-up-text">На курорте <b>{{ resortName }}</b></div>
      <div class="pop-up-text">Когда: <b>{{ formattedDate }}</b> c <b>{{ startTime }}</b> по <b>{{ endTime }}</b></div>
      <div class="pop-up-text">Стоимость: <b>{{ total }}  RUB</b></div>
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
    sel_date: String,
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

    async bookingItem() {
      const startTime = this.startTime + ':00:00';
      const endTime = this.endTime + ':00:00';
      try {
        const response = await fetch('/api/booking', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': '*',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          },
          body: JSON.stringify({
            inventory_id: +this.$props.item.id,
            start_time: this.sel_date + 'T' + startTime + 'Z',
            end_time: this.sel_date + 'T' + endTime + 'Z'
          })
        });
        if(response.ok) {
          this.bookings = await response.json();
          this.$emit('closePopUp', false, true)
        } else {
          console.log('not ok');
          this.$emit('closePopUp', false, false)
        }


      } catch (error) {
        console.error(error)
      }
    }
  },
  computed: {
    formattedDate() {
      let arr = this.sel_date.split('-');
      return arr.reverse().join('.');
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
  width: 50%;
}
</style>