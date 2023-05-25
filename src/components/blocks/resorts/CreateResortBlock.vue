<template>
  <div class="add-resort">
    <h2 class="add-resort__header">
      {{ editMode ? "Страница редактирования карточки курорта" : "Страница создания карточки курорта"}}</h2>
    <div class="form-block resort-name">
      <label for="ResortName">Название курорта</label>
      <input type="text" id="ResortName" v-model="resortName">
    </div>
    <div class="form-block resort-address">
      <label for="resortAddress">Адрес курорта</label>
      <select v-model="cityName">
        <option v-for="city in GET_CITIES" :key="city.id">{{ city.name }}</option>
      </select>
      <input type="text" id="resortAddress" v-model="resortAddress">
    </div>
    <div class="form-block resort-description">
      <label for="resortDescription">Описание курорта</label>
      <input type="text" id="resortDescription" v-model="resortDescription">
    </div>

    <div class="buttons">
      <button @click="addResort" class="cards-btn action">{{
          editMode ? "Изменить данные курорта" : "Создать карточку курорта"
        }}
      </button>

      <button class="cards-btn" @click="cancel">Отмена</button>

      <button @click="goToInventoryManagementPage" class="cards-btn sub-btn"
      v-if="editMode">Управлять инвентарем ></button>

    </div>
    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script>

import InventoryCard from "@/components/items/equipments/InventoryCard.vue";
import SearchEquipmentItem from "@/components/items/equipments/SearchEquipmentItem.vue";
import InventoryManagementPage from "@/components/pages/inventory/InventoryManagementPage.vue";
import paths from "@/data-and-functions/constants/paths";
import {mapActions, mapGetters, mapMutations} from "vuex";

export default {
  components: InventoryCard, SearchEquipmentItem, InventoryManagementPage,
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
  computed: {
    ...mapGetters(['GET_INVENTORY_TYPES', 'GET_CITIES']),
  },
  methods: {
    ...mapMutations(['setSelectedResort']),
    ...mapActions(['fetchInventoryTypes', 'fetchCities']),
    cancel(e) {
      this.$emit('closeAndRefreshAddWindow', e)
    },
    goToInventoryManagementPage() {
      const resort = {
        id: +this.resortId,
        name: this.resortName,
        address: this.resortAddress,
        description: this.resortDescription,
        city_id: +this.cityId,
      }
      this.setSelectedResort(resort);
      this.$router.push({
        path: paths.InventoryManagementPage, query: {
          id: +this.resortId,
        }
      });
    },
    addResort() {
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
    async getInventoryByResort() {
      try {
        const equipments = await fetch(`/api/resorts/inventories/${this.resortId}`);
        this.equipments = await equipments.json();
        if (equipments.ok) {
          console.log('ok');
        } else {
          console.log('not ok');
        }
      } catch (e) {
        console.error(e);
      }
    },
    async deleteItem(id) {
      const res = await fetch(`/api/inventories/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      console.log(res.json());
      if (res.ok) {
        this.counter += 1;
        console.log('inventory item deleted');
      } else {
        console.log('inventory item didn\'t delete');
      }
    },
  },
  async created() {
    this.userId = localStorage.getItem('userId');
    this.resortId = this.resortIdFromParent ? this.resortIdFromParent : Date.now();
    await this.getResorts();

    if (this.GET_INVENTORY_TYPES.length === 0) await this.fetchInventoryTypes();
    if (this.GET_CITIES.length === 0) await this.fetchCities();

    if (this.editMode) {
      console.log(this.resortIdFromParent);
    } else {
      this.cityId = this.GET_CITIES[0].id;
      this.cityName = this.GET_CITIES[0].name;
    }

    this.resorts.forEach(resort => {
      if (resort.id === this.resortId) {
        this.resortName = resort.name;
        this.resortAddress = resort.address;
        this.resortDescription = resort.description;
        this.cityId = resort.city_id;
        this.GET_CITIES.forEach(city => {
          if (city.id === this.cityId) this.cityName = city.name;
        })
      }
    })
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

.add-resort__header {
  margin-bottom: 20px;
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

.resort-name {
  display: flex;
  justify-content: center;
  flex-direction: column;
  text-align: center;
}

.resort-name label, label {
  margin: 10px 0;
}

.buttons {
  width: 40%;
  margin: 1em auto 0;
  display: flex;
  flex-direction: column;
  gap: 1em;
}
</style>
