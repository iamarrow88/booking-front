<template>
  <li class="items-for-resort-item-header">
    <p class="items-for-resort-item-type">{{ types[item.type_id - 1].name }}</p>
    <img class="items-for-resort-item-photo" :src="item.photo" alt="Item Photo">
    <p class="items-for-resort-item-price">{{ item.price }} RUB</p>
    <button @click="addToCart(item.id)">Забронировать</button>
  </li>
</template>

<script>
export default {
  name: "EquipmentItem",
  props: {
    item: {
      id: Number,
      photo: String,
      price: Number,
      resort_id: Number,
      type_id: Number
    },
    types: Array,
    itemsInObj: Object
  },
  data() {
    return {
      bookedItems: 0,
      /*btnIds: [],*/
      itemsToCart: {}
    }

  },
  methods: {
    bookItem(){

    }
  },
  watch: {
    bookedItems(){

    }
  },
  created() {

  }
}

</script>

<style scoped>

</style>