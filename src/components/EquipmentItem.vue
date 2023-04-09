<template>
  <div class="items-for-resort-item">
    <div class="about">
      <div class="items-for-resort-item-header">
        <p class="items-for-resort-item-type column">{{ type.name }}</p>
        <img class="items-for-resort-item-photo column" :src="item.photo" alt="Item Photo">
        <p class="items-for-resort-item-price column">Час - <span>{{ item.price }} RUB</span></p>
        <p class="items-for-resort-item-price column"
           v-if="!editMode">Итого - <span>{{ item.price * duration }} RUB</span></p>
      </div>
    </div>

    <div class="buttons">
      <button @click="showPopUp"
              v-if="!editMode"
              class="items-for-resort-btn">Забронировать</button>
      <button v-if="editMode"
              @click="this.$emit('DeleteItem', item.id)"
              class="items-for-resort-btn">Удалить</button>
      <button v-if="editMode"
              @click="showAddItemBlock"
              class="items-for-resort-btn">Редактировать</button>
    </div>

    <div v-if="isAddingItemModeOn">
      <add-item :editEquipmModeFromParent="false"
                :resortIdFromParent="resortId"></add-item>
    </div>

    <pop-up v-if="!editMode" :item="item"
            :typeName="type.name"
            :isBookingProcessStarted="isBookingProcessStarted"
            :resortName="resortName"
            :sel_date="sel_date"
            :startTime="startTime"
            :endTime="endTime"
            :total = "item.price * duration"
            @closePopUp="closePopUp"></pop-up>
    <modal-window :isOpen="isBooked" @closePopUp="closePopUp"></modal-window>
  </div>
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
    resortId: Number,
    types: {
      id: Number,
      name: String
    },
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
      isBooked: false,
      isAddingItemModeOn: false,
    }
  },
  methods: {
    getEquipmentType() {
      this.types.forEach(type => {
        if(type.id === this.item.type_id) {
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
    showAddItemBlock() {
      this.isAddingItemModeOn = !this.isAddingItemModeOn;
    }
  },
  computed: {
    duration() {
      return +this.endTime - +this.startTime;
    }
  },
  async created() {
    /*try {
      const types = await fetch('/api/inventories/types');
      this.types = await types.json();
    } catch (e) {
      console.error(e);
    }*/
    this.getEquipmentType();
  },
}

</script>

<style scoped>
.items-for-resort-item {
  display: flex;
  flex-direction: column;
}

.column {
  width: 200px;
  text-align: left;
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
  display: flex;
  flex-wrap: wrap;
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

.buttons button {
  margin: 5px;
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