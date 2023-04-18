<template>
  <div v-show="isOpen" class="pop-up" @click="closePopUp">
    <div class="pop-up-block">
      <div class="pop-up-text">
        <b>Готово!</b><br>
        Проверить свои бронирования можно
      <router-link to="/mybooking"><b>здесь</b></router-link>
      </div>
      <button class="pop-up-btn cards-btn" @click="closePopUp">Х</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "ModalWindow",
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

.pop-up-block {
  position: absolute;
  top: 46%;
  left: 35%;
  padding: 65px 35px 30px;
  background-color: #fff;
}

.pop-up-text {
  margin-bottom: 15px;
  line-height: 1.5;
}

.pop-up-btn {
  position: absolute;
  top: 0;
  right: 5px;
  padding: 3px 6px;
}

</style>