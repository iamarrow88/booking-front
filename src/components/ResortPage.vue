<template>
  <div class="items-for-resort">
    <h3 class="items-for-resort-title">Items for {{ resortName }}:</h3>
    <ul v-if="items.length > 0" class="items-for-resort-list">
      <equipment-item v-for="item in items"
                      :key="item.id"
                      class="items-for-resort-item"
                      v-bind:item="item"
                      v-bind:types="types"
                      :typeId="item.type_id"
                      :pageTypeId="$route"></equipment-item>

    </ul>
    <div v-else>
      Ничего не найдено
    </div>
  </div>
</template>

<script>
import EquipmentItem from "@/components/EquipmentItem.vue";

export default {
  components: EquipmentItem,
  data() {
    return {
      resortName: '',
      items: [],
      types: [],
      filterByID: null,
      notFilteredItems: [],
    }
  },
  async mounted() {
    try {
      const response = await fetch(`http://localhost:8081/api/resorts/${this.$route.params.id}`)
      const resort = await response.json()
      this.resortName = resort.name
    } catch (error) {
      console.error(error)
    }
    try {
      const response = await fetch(`http://localhost:8081/api/resorts/inventories/${this.$route.params.id}`)
      this.notFilteredItems = await response.json();
    } catch (error) {
      console.error(error)
    }
    if(this.filterByID) {
      this.items = this.notFilteredItems.filter(item => item.type_id === this.filterByID);
    } else {
      this.items = this.notFilteredItems;
    }

  },
  async created() {
    this.filterByID = +this.$route.query.type_id
    try {
      const types = await fetch('/api/inventories/types')
      this.types = await types.json();
    } catch (error) {
      console.error(error)
    }

  }
}
</script>

<style>
.items-for-resort {
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
}

.items-for-resort-title {
  margin-top: 0;
  font-size: 1.5rem;
  font-weight: bold;
}

.items-for-resort-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.items-for-resort-item {
  margin-bottom: 1rem;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}



@media (max-width: 767px) {
  .items-for-resort-title {
    font-size: 1.25rem;
  }
}
</style>
