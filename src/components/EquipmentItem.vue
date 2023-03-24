<template>
  <li class="items-for-resort-item">
    <div class="items-for-resort-item-header">
      <p class="items-for-resort-item-type">{{ type.name }}</p>
      <img class="items-for-resort-item-photo" :src="item.photo" alt="Item Photo">
      <p class="items-for-resort-item-price">Час - {{ item.price }} RUB</p>
      <p class="items-for-resort-item-price">Итого - {{ item.price * duration }} RUB</p>
      <button @click="showPopUp"
              v-if="!editMode">Забронировать</button>
      <button v-if="editMode" @click="this.$emit('DeleteItem', item.id)">Удалить</button>
      <button v-if="editMode" @click="this.$emit('EditItem', item.id)">Редактировать</button>
    </div>
    <pop-up :item="item"
            :typeName="type.name"
            :isBookingProcessStarted="isBookingProcessStarted"
            :resortName="resortName"
            :sel_date="sel_date"
            :startTime="startTime"
            :endTime="endTime"
            :total = "item.price * duration"
            @closePopUp="closePopUp"></pop-up>
    <modal-window :isOpen="isBooked" @closePopUp="closePopUp"></modal-window>
  </li>
</template>

<script>


import PopUp from "@/components/PopUp.vue";
import ModalWindow from "@/components/ModalWindow.vue";

export default {
  components: PopUp, ModalWindow,
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
    resortName: String,
    editMode: Boolean,
    sel_date: null,
    startTime: String,
    endTime: String
  },
  data() {
    return {
      type: null,
      isBookingProcessStarted: false,
      isBooked: false
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
    closePopUp(bool1, bool2){
      this.isBookingProcessStarted = bool1;
      this.isBooked = bool2;
    },
  },
  computed: {
    duration() {
      return +this.endTime - +this.startTime;
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