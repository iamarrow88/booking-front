<template>
  <div v-if="!isNotFoundShown">
    <equipment-item v-for="item in equipments"
                    :key="item.id"
                    :item="item"
                    :types="types"
                    :editMode="true"
                    @DeleteItem='DeleteItem'
                    @EditItem='EditItem'></equipment-item>
  </div>
  <div v-else>Ничего нет</div>

  <div class="add-equipment-block">
    <button class="sub-btn"
    @click="equipmAddingModeTurn">   Добавить снаряжение</button>
    <add-item v-if="isEquipmAddingModeOn"
    :editEquipmModeFromParent="false"
    @isAddItemBlockOpen="openAddItemBlock"></add-item>
  </div>
</template>

<script>
import equipmentItem from "@/components/EquipmentItem.vue";

export default {
  components: equipmentItem,
  name: "ManageEquipment",
  props: {
    resortId: Number
  },
  data() {
    return {
      equipments: [],
      isNotFoundShown: false,
      userId: null,
      resorts: [],
      types: [],
      isEquipmAddingModeOn: false,
    }
  },
  methods: {
    EditItem(itemId) {
      console.log('edit', itemId);
    },
    DeleteItem(itemId) {
      console.log('delete', itemId);
    },
    equipmAddingModeTurn() {
      this.isEquipmAddingModeOn = !this.isEquipmAddingModeOn;
    },
    openAddItemBlock(bool){
      this.isEquipmAddingModeOn = bool;
    }
},
  async created() {
    this.userId = localStorage.getItem('userId');
    try {
      const response = await fetch(`/api/resorts/inventories/${this.resortId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      this.equipments = await response.json()

    } catch (error) {
      console.error(error);
    }
    try {
      const types = await fetch('/api/inventories/types');
      this.types = await types.json();
    } catch (e) {
      console.error(e);
    }
    /*try {
      const equipments = await fetch('/inventories/filter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          /!*resort_id: 1,
          type_id: 1,
          start_date: 1,
          duration: 1*!/
        })
      });
      this.equipments = await equipments.json();
      this.isNotFoundShown = this.equipments.length === 0;

    } catch (e) {
      console.error(e);
    }*/
  }
}
</script>

<style scoped>
.sub-btn {
  padding: 7px;
  background-color: transparent;
  cursor: pointer;
  color: darkslateblue;
  text-decoration: underline;
}

</style>