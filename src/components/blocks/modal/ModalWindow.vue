<template>
  <div class="pop-up">
    <div class="pop-up__block">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "ModalWindow"
}
</script>

<style scoped>
.pop-up__block {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  padding: 2em;
  border-radius: 6px;
  box-shadow: 1px 1px 12px #fdd4bd;
}
</style>
