<template>
  <div v-show="isOpen" class="pop-up" @click="closePopUp">
    Готово!
    Проверить свои бронирования можно
    <router-link to="/mybooking"><b>здесь</b></router-link>
    <button class="pop-up-btn" @click="closePopUp">Х</button>
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

</style>