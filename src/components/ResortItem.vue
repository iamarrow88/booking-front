<template>
    <div>
      <div>{{ resort.name }}</div>
      <button @click="editResort">Edit</button>
      <button @click="deleteResort">Delete</button>
      <div v-if="isEdit">
        <create-resort-page :resort="resort"></create-resort-page>
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
    },
    data() {
      return {
        isEdit: false,
      }
    }
  },
  methods: {
    editResort() {
      this.$emit('editResort', this.resort.id);
    },
    deleteResort() {
      this.$emit('deleteResort', this.resort.id);
    }
  }

}
</script>

<style scoped>

</style>