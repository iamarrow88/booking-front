<template>
    <div>
      <div>{{ resort.name }}</div>
      <button @click="editResortDown" class="cards-btn">Редактировать</button>
      <button @click="deleteResort" class="cards-btn">Удалить</button>
      <div v-if="isEditComponent">
        <create-resort-block :resortIdFromParent="resort.id"
                            :editMode="isEditComponent"
                            @updateResort="updateResortUp"></create-resort-block>
      </div>
    </div>
</template>

<script>
import CreateResortBlock from "@/components/blocks/resorts/CreateResortBlock.vue";

export default {
  components: CreateResortBlock,
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