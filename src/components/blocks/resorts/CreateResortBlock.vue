<template>
  <div class="add-resort">
    <h2>{{ editMode ? "Страница редактирования карточки курорта" : "Страница создания карточки курорта" }}</h2>
    <div class="form-block resort-name">
      <label for="ResortName">Введите название курорта</label>
      <input type="text" id="ResortName" v-model="resortName">
    </div>
    <div class="form-block resort-address">
      <label for="resortAddress">Введите адрес курорта</label>
      <select v-model="cityName">
        <option v-for="city in cities" :key="city.id">{{ city.name }}</option>
      </select>
      <input type="text" id="resortAddress" v-model="resortAddress">
    </div>
    <div class="form-block resort-description">
      <label for="resortDescription">Введите описание курорта</label>
      <input type="text" id="resortDescription" v-model="resortDescription">
    </div>

    <button @click="addResort" class="cards-btn">{{ editMode ? "Изменить данные курорта" : "Создать карточку курорта" }}</button>

    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>

    <div class="manage-equipment-block" v-if="editMode">
      <button class="sub-btn"
      @click="getEquipments">Управлять инвентарем</button>
      <div class="equipment-list" v-if="!isEquipmManagingHide && equipments.length > 0">
        <search-equipment-item v-for="item in equipments"
                        :key="item.id"
                        :item="item"
                        :resortId="resortId"
                        :types="types"
                        :editMode="true"
                        @DeleteItem="deleteItem"></search-equipment-item>
      </div>
      <div class="add-item">
        <button @click="addItem" class="sub-btn">Добавить инвентарь</button>
        <inventory-card :IsEditEquipmModeOnFParent="false"
                  :resortIdFromParent="resortId"
                  v-if="isAddingItemModeOn"
                  @isAddItemBlockOpen="closeAddItem"></inventory-card>

      </div>
    </div>
  </div>
</template>

<script>

import InventoryCard from "@/components/items/equipments/InventoryCard.vue";
import SearchEquipmentItem from "@/components/items/equipments/SearchEquipmentItem.vue";

export default {
  components: InventoryCard, SearchEquipmentItem,
  name: "CreateResortBlock",
  props: {
    resortIdFromParent: Number,
    editMode: Boolean,
  },
  data() {
    return {
      cities: [],
      resorts: [],
      types: [],

      resortId: null,
      cityId: null,

      resortName: '',
      resortAddress: '',
      resortDescription: '',
      cityName: '',

      userId: null,
      errorMessage: null,
      isEditComponent: null,

      equipments: [],
      isEquipmManagingHide: true,
      counter: 0,
      isAddingItemModeOn: false,
      itemsCounter: 0,
    }
  },
  methods: {
    addResort () {
      console.log('create resort');
      this.$emit('updateResort', this.editMode, this.cityId, this.resortId, this.resortName, this.resortAddress, this.resortDescription, this.userId);
    },
    async getResorts() {
      try {
        const resorts = await fetch('/api/resorts');
        this.resorts = await resorts.json();
      } catch (e) {
        console.error(e);
      }
    },
    async getInventoryByResort(){
      try {
        const equipments = await fetch(`/api/resorts/inventories/${this.resortId}`);
        this.equipments = await equipments.json();
        if(equipments.ok){
          console.log('ok');
        } else {
          console.log('not ok');
        }
      } catch (e) {
        console.error(e);
      }
    },
    getEquipments(){
      this.isEquipmManagingHide=!this.isEquipmManagingHide;
      this.getInventoryByResort();
    },
    async deleteItem(id) {
      const res = await fetch(`/api/inventories/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      console.log(res.json());
      if(res.ok) {
        this.counter += 1;
        console.log('inventory item deleted');
      } else {
        console.log('inventory item didn\'t delete')

      }
    },
    addItem() {
      this.isAddingItemModeOn = !this.isAddingItemModeOn;
    },
    closeAddItem(bool) {
      this.isAddingItemModeOn = bool;
      this.itemsCounter += 1;
    }
  },
  async created() {
    this.userId = localStorage.getItem('userId');
    this.isEditComponent = this.editMode;
    this.resortId = this.resortIdFromParent ? this.resortIdFromParent : Date.now();
    await this.getResorts();

    try {
      const cities = await fetch('/api/cities');
      this.cities = await cities.json();
      if(!this.editMode) {
        this.cityName = this.cities[0].name;
        this.cityId = this.cities[0].id
      }
    } catch (error) {
      console.error(error)
    }

    this.resorts.forEach(resort => {
      if(resort.id === this.resortId){
        this.resortName = resort.name;
        this.resortAddress = resort.address;
        this.resortDescription = resort.description;
        this.cityId = resort.city_id;
        this.cities.forEach(city => {
          if(city.id === this.cityId) this.cityName = city.name;
        })
      }
    })

    try {
      const types = await fetch('/api/inventories/types');
      this.types = await types.json();
    } catch (e) {
      console.error(e);
    }

    /*try {
      const types = await fetch('/api/')
    }*/
  },
  watch: {
    counter() {
      this.getInventoryByResort();
    },
    itemsCounter() {
      this.getInventoryByResort();
    }
  }
}
</script>

<style scoped>
  .add-resort {
    margin: 30px auto;
    padding: 1rem;
    width: 50vw;
    border: 1px solid #ccc;
    border-radius: 0.5rem;
  }

  input {
    margin: 0 auto;
    max-width: 500px;
  }
  .resort-address, select, option {
    margin: 0 auto;
    max-width: 542px;
  }
  .resort-address select {
    width: 42%;
  }
  .resort-address input {
    width: 50%;
  }
</style>