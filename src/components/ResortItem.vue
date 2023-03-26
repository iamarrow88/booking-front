<template>
    <div>
      <div>{{ resort.name }}</div>
      <button @click="editResortDown">Редактировать</button>
      <button @click="deleteResort">Удалить</button>
      <div v-if="isEditComponent">
        <create-resort-page :resortIdFromParent="resort.id"
                            :editMode="isEditComponent"
                            @updateResort="updateResortUp"></create-resort-page>
      </div>
    </div>
</template>

<script>
import CreateResortPage from "@/components/CreateResortPage.vue";

export default {
  components: CreateResortPage,
  name: "ResortItem",
  props: {
    resort: {
      id: Number,
      name: String,
      city_id: Number,
      owner_id: Number,
      description: String,
      address: String,
      isEdit: Boolean
    },
  },
  data() {
    return {
      isEditComponent: false,
    }
  },
  methods: {
    editResortDown() {
      this.isEditComponent = !this.isEditComponent
    },
    deleteResort() {
      this.$emit('deleteResort', this.resort.id);
    },
    updateResortUp(editMode, cityId, resortId, resortName, resortAddress, resortDescription, userId) {
      this.isEditComponent = false;
      this.$emit('editResortFromItem', editMode, cityId, resortId, resortName, resortAddress, resortDescription, userId);
    }
  },
  created() {
    this.isEditComponent = this.isEdit;
  }

}
</script>

<style scoped>

</style>