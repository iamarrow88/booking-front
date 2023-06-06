<template>
  <div class="info">
    <div class="pop-up__block">
      <div class="info__text">Сначала необходимо войти в аккаунт или зарегистрироваться</div>
      <div class="buttons">
        <button class="btn cards-btn action" @click="this.$emit('GoToAuthPage')">На страницу авторизации</button>
        <button class="btn cards-btn" @click="this.$emit('Back')">Назад</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "InformationWindow"
}
</script>

<style scoped>

.info {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(178, 178, 178, .3);
  z-index: 10;
}

.pop-up__block {
  width: 350px;
  height: 160px;
  gap: 30px;
  font-family: 'Roboto', sans-serif;
}

.buttons {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}
.btn:last-child {
  margin: 10px auto 0;
  width: 50%;
}

</style>
