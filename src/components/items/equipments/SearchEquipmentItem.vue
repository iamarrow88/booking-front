<template>
  <div class="equipment-item">
    <div class="equipment-item__about">
      <div class="equipment-item__type-name">{{ type.name }}</div>
      <div class="equipment-item__photo-block">
        <img v-if="item.photo" class="equipment-item__photo"
             src="item.photo"
             alt="Item Photo">
        <img v-else class="equipment-item__photo"
             src="../../../assets/no-photo.jpg"
             alt="Item Photo">
      </div>
      <div class="equipment-item__price">Стоимость 1 часа - <span>{{ item.price }} RUB</span></div>
      <div class="equipment-item__summary">
        <div class="summary__duration"
             v-if="!editMode">Аренда на {{ duration }} {{hoursNaming}}</div>
        <div class="summary__total"
             v-if="!editMode">Итого - <span>{{ item.price * duration }} RUB</span></div>
      </div>
    </div>

    <div class="buttons">
      <button @click="showPopUp"
              v-if="!editMode"
              class="btn cards-btn">Забронировать</button>
      <button v-if="editMode"
              @click="showAddItemBlock"
              class="btn cards-btn">Редактировать</button>
      <button v-if="editMode"
              @click="this.$emit('DeleteItem', item.id)"
              class="btn cards-btn">Удалить</button>
    </div>

    <div v-if="isAddingItemModeOn">
      <inventory-card :IsEditEquipmModeOnFParent="true"
                :resortIdFromParent="resortId"
                :itemFromParent="item"
      @isAddItemBlockOpen="closeAddItem"></inventory-card>
    </div>

    <div v-if="isAddingItemModeOn">
      <inventory-card :IsEditEquipmModeOnFParent="true"
                :resortIdFromParent="resortId"
                :itemFromParent="item"
      @isAddItemBlockOpen="closeAddItem"></inventory-card>
    </div>

    <confirm-window v-if="!editMode" :item="item"
            :typeName="type.name"
            :isBookingProcessStarted="isBookingProcessStarted"
            :resortName="resortName"
            :selDateStartShort="selDateStartShort"
            :selDateEndShort="selDateEndShort"
            :startTime="startTime"
            :endTime="endTime"
            :total = "item.price * duration"
            :duration = "duration"
            @closePopUp="closePopUp"></confirm-window>
    <success-window :isOpen="isBooked" @closePopUp="closePopUp"></success-window>
  </div>
</template>

<script>


import ConfirmWindow from "@/components/blocks/modal/ConfirmWindow.vue";
import SuccessWindow from "@/components/blocks/modal/SuccessWindow.vue";
import InventoryCard from "@/components/items/equipments/InventoryCard.vue";

export default {
  components: ConfirmWindow, SuccessWindow, InventoryCard,
  name: "SearchEquipmentItem",
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
    selDateStartShort: null,
    selDateEndShort: null,
    startTime: String,
    endTime: String,
    duration: Number,
    hoursNaming: String,
  },
  data() {
    return {
      type: null,
      isBookingProcessStarted: false,
      isBooked: false,
      isAddingItemModeOn: false,
      itemsCounter: 0,
      today: null,
      componentDuration: null,

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
    },
    closeAddItem(bool) {
      this.isAddingItemModeOn = bool;
      this.itemsCounter += 1;
    },
    async getInventoryByResort(){
      try {
        const equipments = await fetch(`/api/resorts/inventories/${this.resortId}`);
        this.equipments = await equipments.json();
        if(equipments.ok){
          console.log('получили данные по инвентарю с курорта ' + this.resortName);
        } else {
          console.log('не удалось получить данные по инвентарю с курорта ' + this.resortName);
        }
      } catch (e) {
        console.error(e);
      }
    },
    calcDuration() {
      const msPerHours = 60 * 60 * 1000;
      const start = new Date(this.selDateStartShort + ' ' + this.startTime + ':00:00');
      const end = new Date(this.selDateEndShort + ' ' + this.endTime + ':00:00');
      return (end - start) / msPerHours
    },
  },
  watch: {
    itemsCounter() {
      this.getInventoryByResort();
    },
    startTime() {
      this.componentDuration = this.calcDuration();
    },
    endTime() {
      this.componentDuration = this.calcDuration();
    }
  },
  async created() {
    this.getEquipmentType();
    this.today = (new Date().toISOString().slice(0, 10));
    this.componentDuration = this.$route.query.duration;
  },

}

</script>

<style scoped>
.equipment-item {
  padding: 20px;
  border: 0 solid #899bb0;
  box-shadow: 7px 7px 20px #c5daf3;
  font-size: 1.25rem;
}

.equipment-item__about {
  display: flex;
  flex-direction: column;
}

.equipment-item__type-name {
  margin-bottom: 20px;
  width: 100%;
  display: flex;
  justify-content: start;
  font-size: 28px;
}

.equipment-item__photo-block {
  margin: 0 auto 30px;
  width: 90%;
  min-height: 150px;
}

.equipment-item__photo {
  max-width: 100%;
  max-height: 100%;
}

.equipment-item__price {
  margin-bottom: 10px;
  display: flex;
  justify-content: start;
}

.equipment-item__summary {
  margin-bottom: 25px;
  display: flex;
  justify-content: start;
  flex-wrap: wrap;
  gap: 10px;
  width: 100%;
}

.no-scroll {
  overflow: hidden;
  background-color: rgba(178, 178, 178, .3);
  z-index: 10;
}
@media (max-width: 767px) {

  .equipment-item {
    font-size: 1rem;
  }

  .equipment-item__type-name {
    font-size: 1.25rem;
  }
}
</style>