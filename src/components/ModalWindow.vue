<template>
  <div v-show="isOpen" class="pop-up" @click="closePopUp">
    <div class="pop-up-block">
      <div class="pop-up-text">Готово!
      Проверить свои бронирования можно
      <router-link to="/mybooking"><b>здесь</b></router-link>
      </div>
      <button class="pop-up-btn" @click="closePopUp">Х</button>
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
      this.$emit('closePopUp', false, false)
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
  padding: 65px 25px 30px;
  background-color: #fff;
}

.pop-up-text {
  margin-bottom: 15px;
}

.pop-up-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 7px;
}

</style>