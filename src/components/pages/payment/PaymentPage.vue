<template>
  <div class="payment" v-if="!isPaymentOk">
    <div class="payment__title">Сумма к оплате {{ total }} RUB</div>
    <div class="payment__subtitle">Введите номер карты :)</div>
    <div class="card">
      <div class="front-card__inputs">
        <div class="number-form">
          <label for="cardNumber">Номер карты</label>
          <input type="number" class="card__number" id="cardNumber" placeholder="1234 5678 1234 5678">
        </div>
        <div class="term-form">
          <label for="cardTerm">Срок действия</label>
          <div class="term-form__inputs">

            <input type="text" class="card__month" id="cardTerm" placeholder="04">/
            <input type="text" class="card__year" placeholder="25">

          </div>
        </div>
        <div class="holderName-form">
          <label for="cardHolderName">Имя и фамилия владельца карты</label>
          <input type="text" class="card__cardholder-name" id="cardHolderName" placeholder="IVAN PETROV">
        </div>
      </div>
      <div class="back-card__inputs">
        <div class="cvc-form">
          <label for="cardCvc">CVC/CCV</label>
          <input type="password" class="card__cvc" id="cardCvc">
        </div>
      </div>
    </div>
    <div class="buttons">
      <button @click="bookingItem" class="cards-btn action">Я ввел, честно</button>
      <button @click="goToPrevPage" class="cards-btn">Передумал</button>
    </div>
  </div>
  <div v-else>
    <success-window :isOpen="isOpen" @closePopUp="closePopUp"></success-window>
  </div>
</template>

<script>
import SuccessWindow from "@/components/blocks/modal/SuccessWindow.vue";
import paths from "@/data-and-functions/constants/paths";

export default {
  name: "PaymentPage",
  components: SuccessWindow,
  data() {
    return {
      bookings: [],
      isPaymentOk: false,
      isOpen: true,
      total: null,
      isCVCVisible: false
    }
  },
  methods: {
    async bookingItem() {
      let endTime = localStorage.getItem('endTime');
      let endDate = localStorage.getItem('endDateShort');
      if(endTime === '24') {
        endTime = '00';
        endDate = this.addDayToDate(endDate, 'short', 1)
      }
      const body = {
          "inventory_id": +localStorage.getItem('selectedItemID'),
          "start_time": localStorage.getItem('startDateShort') + 'T' + localStorage.getItem('startTime') + ':00:00Z',
          "end_time": endDate + 'T' + endTime + ':00:00Z',
      }
      console.log(body);
      try {
        const response = await fetch('/api/booking', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': '*',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(body)
        });
        if (response.ok) {
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
      this.$router.push({path: paths.UserBookingPage, query: {isUserBookingsPage: true}})
    },
    addDayToDate(dateFull, dateType, daysToAdd) {
      let date = dateType === 'short' ? new Date(dateFull) : dateFull;
      return new Date(date.setDate(new Date().getDate() + daysToAdd)).toISOString().slice(0, 10);
    },
    goToPrevPage(){
      this.$router.push(paths.ResortPageByID)
    }
  },
  created() {
    if(!localStorage.getItem('token')){
      console.log('Сначала нужно авторизоваться');

    }
    this.total = this.$route.query.total ? this.$route.query.total : localStorage.getItem('totalPrice');
  }
}
</script>

<style scoped>
.payment {
  margin: 0 auto;
  padding: 4em;
  width: 80%;
}

.payment__title {
  font-size: 48px;
  margin-bottom: 50px;
  text-align: center;
}

.payment__subtitle {
  font-size: 36px;
  margin-bottom: 30px;
}

.card {
  position: relative;
  width: 545px;
  height: 1px;
  margin: 0 auto;
}

input {
  border-radius: 1px;
  border: 1px solid orangered;
  padding: 5px 10px;
}

.front-card__inputs, .back-card__inputs {
  position: absolute;
  top: 0;
  left: 0;
  width: 382px;
  height: 243px;
  border: 2px solid gray;
  border-radius: 8px;
}

.front-card__inputs {
  z-index: 5;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  background-color: #dae8f6;
}

.back-card__inputs {
  z-index: 1;
}

.back-card__inputs {
  top: 12px;
  left: 159px;
  background-color: #e9eef5;
}

label {
  margin-bottom: 5px;
  text-align: left;
}

.number-form {
  position: absolute;
  top: 0;
  left: 20px;
}

.card__number, .card__cardholder-name {
  height: 33px;
  width: 300px;
}

.term-form {
  position: absolute;
  top: 73px;
  left: 20px;
}

.term-form__inputs {
  width: 102px;
  height: 33px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card__month, .card__year {
  width: 40px;
  height: 33px;
}

.holderName-form {
  position: absolute;
  top: 142px;
  left: 20px;
}

.cvc-form {
  position: relative;
  top: 17px;
  left: 243px;
  width: 100px;
}

.card__cvc {
  width: 100px;
}

.buttons {
  margin: 300px auto 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 0.7em;
}

.cards-btn {
  margin: 0 auto;
  width: 50%;
}

</style>
