<template>
  <div v-if="!isNotFoundShown">
    <equipment-item v-for="item in equipments"
                    :key="item.id"
                    :item="item"
                    :editMode="true"
                    @DeleteItem='DeleteItem'
                    @EditItem='EditItem'></equipment-item>
  </div>
  <div v-else>Ничего нет</div>
  <div @click="this.$router.push({path: '/addEquipment',
                                  query: {editMode: false}})">
                                  Добавить снаряжение</div>
</template>

<script>
import equipmentItem from "@/components/EquipmentItem.vue";

export default {
  components: equipmentItem,
  name: "ManageEquipment",
  data() {
    return {
      equipments: [],
      isNotFoundShown: false,
      userId: null,
      resorts: [],
    }
  },
  methods: {
    EditItem(itemId) {
      console.log('edit', itemId);
    },
    DeleteItem(itemId) {
      console.log('delete', itemId);
    }
},
  async created() {
    this.userId = localStorage.getItem('userId');
    try {
      const response = await fetch('/api/resorts/filter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*'

        },
        body: JSON.stringify({
          owner_id: this.userId,
        })
      });
      this.resorts = await response.json()
      console.log(`чет нашел`);
    } catch (error) {
      console.error(error)
    }
    try {
      const equipments = await fetch('/inventories/filter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*'
        },
        body: JSON.stringify({
          /*resort_id: 1,
          type_id: 1,
          start_date: 1,
          duration: 1*/
        })
      });
      this.equipments = await equipments.json();
      this.isNotFoundShown = this.equipments.length === 0;

    } catch (e) {
      console.error(e);
    }
  }
}
</script>

<style scoped>

</style>