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
    }
  },
  methods: {
    EditItem(itemId) {
      // !! TODO проверить добавление снаряжения, сделать редактирование, удаление
      console.log('edit', itemId);
    },
    DeleteItem(itemId) {
      console.log('delete', itemId);
    }
},
  created() {
  }
}
</script>

<style scoped>

</style>