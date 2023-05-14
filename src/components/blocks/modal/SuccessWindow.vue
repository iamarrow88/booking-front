<template>
  <div v-show="isOpen" class="pop-up" @click="closePopUp">
    <div class="pop-up__block">
      <div class="pop-up-text">
        <b>Готово!</b>
      </div>
      <div class="pop-up-text">
        Проверить свои бронирования можно в
        <router-link to="/user/bookings"><b> Вашем аккаунте</b></router-link>
      </div>
      <button class="pop-up__close-btn cards-btn" @click="closePopUp">Х</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "SuccessWindow",
  props: {
    isOpen: Boolean,
  },
  methods: {
    closePopUp() {
      this.$emit('closePopUp', false);
    }
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


.pop-up-text {
  margin-bottom: .5em;
  line-height: 1.5;
  font-size: 20px;
}

.pop-up__close-btn {
  position: absolute;
  top: 17px;
  right: 17px;
  padding: 5px 9px;
}

</style>
