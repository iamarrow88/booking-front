<template>
  <li class="items-for-resort-item">
    <div class="items-for-resort-item-header">
      <p class="items-for-resort-item-type">{{ type.name }}</p>
      <img class="items-for-resort-item-photo" :src="item.photo" alt="Item Photo">
      <p class="items-for-resort-item-price">{{ item.price }} RUB</p>
      <button @click="showPopUp">Забронировать</button>
    </div>
    <pop-up :item="item"
    :typeName="type.name"
    :isBookingProcessStarted="isBookingProcessStarted"
            :resortName="resortName"
            :startDate="startDate"
            :duration="duration"
    @closePopUp="closePopUp"></pop-up>
  </li>
</template>

<script>


import PopUp from "@/components/PopUp.vue";

export default {
  components: PopUp,
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
    pageTypeId: Object,
    resortName: String,
    startDate: String,
    duration: Number
  },
  data() {
    return {
      type: null,
      isBookingProcessStarted: false
    }
  },
  methods: {
    getEquipmentType() {
      this.types.forEach(type => {
        if(type.id === this.typeId) {
          this.type = type;
        }
      })
    },
    showPopUp() {
      this.isBookingProcessStarted = !this.isBookingProcessStarted;
    },
    closePopUp(bool){
      this.isBookingProcessStarted = bool;
    }
  },
  created() {
    this.getEquipmentType();
  },
}

</script>

<style scoped>
.items-for-resort-item {
  display: flex;
  flex-direction: column;
}
.items-for-resort-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-grow: 1;
  margin-right: 1rem;
  width: 100%;
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