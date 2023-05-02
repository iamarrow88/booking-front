<template>
  <p class="item__description" v-if="isMoreShown"><b>Описание:</b> {{ description }}</p>

</template>

<script>
export default {
  name: "ResortDescritption",
  props: {
    description: String,
    isMoreShown: Boolean
  }
}
</script>

<style scoped>

</style>