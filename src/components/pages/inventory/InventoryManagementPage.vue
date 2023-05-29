<template>
  <div class="manage-equipment-block">
    <div class="add-item">
      <button @click="addItem" class="sub-btn">Добавить инвентарь</button>
      <teleport to="body">
        <modal-window v-if="isAddingItemModeOn" @closePopUp="isAddingItemModeOn=false">
          <inventory-card :IsEditEquipmModeOnFParent="false"
                          :resortIdFromParent="0"
                          itemFromParent="undefined"
                          @isAddItemBlockOpen="closeAddItem"
                          @closeAndRefreshAddWindow="isAddingItemModeOn=false">

          </inventory-card>
        </modal-window>
      </teleport>
    </div>

    <div class="equipment-list" v-if="equipments.length > 0">
      <search-equipment-item :item="item"
                             :resortId="resort.id"
                             :editMode="true"
                             @DeleteItem="deleteItem"
                             @refreshInventoryArray="refreshInventoryArray"
                             v-for="item in equipments" :key="item.id">
      </search-equipment-item>
    </div>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import SearchEquipmentItem from "@/components/items/equipments/SearchEquipmentItem.vue";
import ModalWindow from "@/components/blocks/modal/ModalWindow.vue";
import InventoryCard from "@/components/items/equipments/InventoryCard.vue";

export default {
  name: "InventoryManagementPage",
  components: SearchEquipmentItem, ModalWindow, InventoryCard,
  data() {
    return {
      equipments: [],
      refreshInventoryArrayCounter: 0,
      resort: {
      },
      isAddingItemModeOn: false,
    }
  },
  computed: {
    ...mapGetters(['GET_SEL_RESORT', 'GET_INVENTORY_TYPES']),
  },
  watch: {
    refreshInventoryArrayCounter(){
      this.getInventoryByResort();
    }
  },
  methods: {
    async getInventoryByResort() {
      try {
        const equipments = await fetch(`/api/resorts/inventories/${this.resort.id}`);
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
      console.log(id);
      const res = await fetch(`/api/inventories/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      console.log(res.json());
      if (res.ok) {
        this.counter += 1;
        this.refreshInventoryArray();
        console.log('inventory item deleted');
      } else {
        console.log('inventory item didn\'t delete')

      }
    },
    refreshInventoryArray(){
      this.refreshInventoryArrayCounter += 1;
    },
    getEquipments() {
      this.isEquipmManagingHide = !this.isEquipmManagingHide;
      this.getInventoryByResort();
    },
    addItem() {
      this.isAddingItemModeOn = !this.isAddingItemModeOn;
    },
    closeAddItem() {
      this.isAddingItemModeOn = false;
      this.itemsCounter += 1;
      this.refreshInventoryArray();
    },
  },
  async mounted() {
    if(!this.GET_SEL_RESORT) {
      console.log('нету ничего');
      this.resort.id = +this.$route.query.id;
    } else {
      this.resort.id = +this.GET_SEL_RESORT.id;
    }
    await this.getInventoryByResort();
  }
}
</script>

<style>

.equipment-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: .2em;
  justify-content: flex-start;
  width: 90%;
  margin: 0 auto;
}

.add-item {
  width: 100%;
  padding: 3em;
}

.equipment-list > .equipment-item > .buttons {
  width: 55%;
  margin: 0 auto;
}

.equipment-item {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.equipment-item__price2 {
  display: block;
  color: red;
}
.manage-equipment-block > .equipment-item__body {
  height: auto;
}

.manage-equipment-block > .equipment-item__price {
  display: none;
}

.manage-equipment-block > .equipment-item__price2 {
  display: block;
}
</style>
