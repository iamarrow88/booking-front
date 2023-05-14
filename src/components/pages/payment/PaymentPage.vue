<template>
  <div class="payment" v-if="!isPaymentOk">
    <div class="payment__title">Сумма к оплате {{ total }} RUB</div>
    <div class="payment__subtitle">Введите номер карты :)</div>
    <div class="card">
      <div class="card__img">
        <!--        <img src="../assets/card.png" alt="card">-->
      </div>
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
    <button @click="bookingItem" class="cards-btn">Я ввел, честно</button>
  </div>
  <div v-else>
    <success-window :isOpen="isOpen" @closePopUp="closePopUp"></success-window>
  </div>
</template>

<script>
import SuccessWindow from "@/components/blocks/modal/SuccessWindow.vue";
import {mapGetters} from "vuex";
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
  computed: {
    ...mapGetters(['GET_SAVED_DATA', 'GET_USER_TOKEN']),
  },
  methods: {
    async bookingItem() {
      let body;
      if(this.GET_SAVED_DATA.item.id){
        body = {
          "inventory_id": +this.GET_SAVED_DATA.item.id,
          "start_time": this.GET_SAVED_DATA.startDateShort + 'T' + this.GET_SAVED_DATA.startTime + ':00:00Z',
          "end_time": this.GET_SAVED_DATA.endDateShort + 'T' + this.GET_SAVED_DATA.endTime + ':00:00Z',
        }
      } else {
        body = {
          inventory_id: +this.$route.query.itemId,
          start_time: this.$route.query.selDateStartShort + 'T' + this.$route.query.startTime + ':00:00Z',
          end_time: this.$route.query.selDateStartShort + 'T' + this.$route.query.endTime + ':00:00Z'
        }
      }
      console.log(body);
      try {
        const response = await fetch('/api/booking', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': '*',
            'Authorization': 'Bearer ' + this.GET_USER_TOKEN
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
      this.$router.push(paths.UserBookingPage)
    }
  },
  created() {
    if(!localStorage.getItem('firstName')){
      console.log('Сначала нужно авторизоваться')

    }
    this.total = this.$route.query.total;
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
  width: 50%;
  margin: 0 auto;
}

.card__img {
  display: flex;
  justify-content: start;
  /*background-image: url("../assets/card.png");*/
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
  align-items: start;
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
  top: 16px;
  left: 20px;
}

.card__number, .card__cardholder-name {
  height: 33px;
  width: 300px;
}

.term-form {
  position: absolute;
  top: 88px;
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
  top: 162px;
  left: 20px;
}

.cvc-form {
  position: relative;
  top: 31px;
  left: 243px;
  width: 100px;
}

.card__cvc {
  width: 100px;
}

.cards-btn {
  margin-top: 300px;
}

</style>
