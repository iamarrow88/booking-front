<template>
  <li class="items-for-resort-item-header">
    <p class="items-for-resort-item-type">{{ typeName }}</p>
    <img class="items-for-resort-item-photo" :src="item.photo" alt="Item Photo">
    <p class="items-for-resort-item-price">{{ item.price }} RUB</p>
    <button>Забронировать</button>
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
    typeId: Number,
    pageTypeId: Object
  },
  data() {
    return {
      typeName: null,
    }
  },
  methods: {
    getEquipmentType() {
      this.types.forEach(type => {
        if(type.id === this.typeId) {
          this.typeName = type.name
        }
      })
    }
  },
  created() {
    this.getEquipmentType();
  },
}

</script>

<style scoped>
.items-for-resort-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-grow: 1;
  margin-right: 1rem;
}

.items-for-resort-item-type {
  margin: 0;
  font-size: 1.25rem;
  font-weight: bold;
}

.items-for-resort-item-price {
  margin: 0;
  font-size: 1.25rem;
  color: #666;
}

.items-for-resort-item-photo {
  height: 100%;
  max-height: 10rem;
  object-fit: cover;
  border-radius: 0.5rem;
}
@media (max-width: 767px) {

  .items-for-resort-item-type {
    font-size: 1rem;
  }

  .items-for-resort-item-price {
    font-size: 1rem;
  }
}
</style>