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
      equipments: [
          {
            id:4,
            type_id:4,
            resort_id:1,
            price:100,
            photo:"",
          },
          {
            id:11,
            type_id:4,
            resort_id:1,
            price:100,
            photo:"",
          }

  ],
      isNotFoundShown: false,
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
  /*async created() {
    try {
      const equipments = await fetch('/inventories/filter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*'
        },
        body: JSON.stringify({
          /!*resort_id: 1 || 2 || 3,*!/
        })
      });
      this.equipments = await equipments.json();
      this.isNotFoundShown = this.equipments.length === 0;
      console.log(this.equipments.length);
    } catch (e) {
      console.error(e);
    }
  }*/
}
</script>

<style scoped>

</style>