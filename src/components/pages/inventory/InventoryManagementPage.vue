<template>
  <div class="manage-equipment-block">
    <div class="add-item">
      <button @click="addItem" class="sub-btn">Добавить инвентарь</button>
      <inventory-card :IsEditEquipmModeOnFParent="false"
                      :resortIdFromParent="resortId"
                      v-if="isAddingItemModeOn"
                      @isAddItemBlockOpen="closeAddItem">

      </inventory-card>

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

export default {
  name: "InventoryManagementPage",
  components: SearchEquipmentItem,
  data() {
    return {
      equipments: [],
      refreshInventoryArrayCounter: 0,
      resort: {
      },
    }
  },
  computed: {
    ...mapGetters(['GET_SEL_RESORT', 'GET_INVENTORY_TYPES', 'GET_USER_TOKEN']),
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
          Authorization: `Bearer ${this.GET_USER_TOKEN}`
        }
      });
      console.log(res.json());
      if (res.ok) {
        this.counter += 1;
        console.log('inventory item deleted');
      } else {
        console.log('inventory item didn\'t delete')

      }
    },
    refreshInventoryArray(){
      this.refreshInventoryArrayCounter += 1;
    }
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

<style scoped>

.equipment-list {
  display: flex;
  flex-wrap: wrap;
  gap: .2em;
  justify-content: flex-start;
  width: 90%;
  margin: 0 auto;
}

.add-item {
  width: 100%;
  padding: 3em;
}

</style>
