<template>
  <div class="resort-item">
    <div class="resort-item__name">{{ resort.name }}</div>
    <div class="buttons">
      <button @click="editResortDown" class="cards-btn action">Редактировать</button>
      <button @click="deleteResort" class="cards-btn">Удалить</button>
    </div>
    <modal-window v-if="isEditResortWindowOpen" @closePopUp="isEditResortWindowOpen=false">
      <create-resort-block :resortIdFromParent="resort.id"
                           :editMode="true"
                           @updateResort="updateResortUp"
      @closeAndRefreshAddWindow="closeAndRefreshAddWindow"></create-resort-block>
    </modal-window>
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
      isEditResortWindowOpen: false,
    }
  },
  methods: {
    editResortDown() {
      this.isEditResortWindowOpen = !this.isEditResortWindowOpen;
    },
    deleteResort() {
      this.$emit('deleteResort', this.resort.id);
    },
    updateResortUp(editMode, cityId, resortId, resortName, resortAddress, resortDescription, userId) {
      this.isEditResortWindowOpen = !this.isEditResortWindowOpen;
      this.$emit('editResortFromItem', editMode, cityId, resortId, resortName, resortAddress, resortDescription, userId);
    },
    closeAndRefreshAddWindow(e){
      this.isEditResortWindowOpen = !this.isEditResortWindowOpen;
      console.log(e);
    }
  },
  created() {
    this.isEditComponent = this.isEdit;
  }

}
</script>

<style scoped>
.resort-item {
  padding: 40px;
  border: 0 solid #899bb0;
  box-shadow: 7px 7px 20px #c5daf3;
  font-size: 1.25rem;
  order: 2;
  transition: all .3ms;
  width: 26%;
}

.buttons {
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  width: 60%;
  margin: 1em auto 0;
}

</style>
