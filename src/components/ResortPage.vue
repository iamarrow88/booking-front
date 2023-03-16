<template>
  <div class="items-for-resort">
    <div class="form-group">
      <label for="startDate">Start Date:</label>
      <input type="date" class="form-control" id="startDate" v-model="startDate">
    </div>
    <label for="typeInput">Type</label>
    <select class="form-control" id="typeInput" v-model="selectedType">
      <option v-for="type in types" :key="type.id" :value="type">{{ type.name }}</option>
    </select>
    <div class="form-group">
      <label for="duration">Duration (days):</label>
      <input type="number" class="form-control" id="duration" v-model.number="duration">
    </div>
    <h3 class="items-for-resort-title">Items for {{ resortName }}:</h3>
    <ul v-if="items.length > 0" class="items-for-resort-list">
      <equipment-item v-for="item in filteredItems"
                      :key="item.id"
                      class="items-for-resort-item"
                      :item="item"
                      :typeId="item.type_id"
                      :pageTypeId="$route"
                      :resortName="resortName"
                      :startDate="startDate"
                      :duration="duration"></equipment-item>

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
      itemTypeId: null,
      notFilteredItems: [],
      duration: null,
      startDate: null,
      selectedType: null,
      filteredItems: [],
    }
  },
  methods: {
    getEquipmentType() {
      this.types.forEach(type => {
        if (type.id === this.itemTypeId) {
          this.selectedType = type;
        }
      })
    },
  },
  watch: {
    selectedType: {
      deep: true,
      handler: function(newValue) {
        this.filteredItems = this.notFilteredItems.filter(item => item.type_id === newValue.id)

      }
    },
  },
  async mounted() {
    try {
      const response = await fetch(`/api/resorts/${this.$route.params.id}`)
      const resort = await response.json()
      this.resortName = resort.name
    } catch (error) {
      console.error(error)
    }
    try {
      const response = await fetch(`/api/resorts/inventories/${this.$route.params.id}`)
      this.notFilteredItems = await response.json();
    } catch (error) {
      console.error(error)
    }
    this.getEquipmentType();
    if (this.itemTypeId) {
      this.items = this.notFilteredItems.filter(item => item.type_id === this.itemTypeId);
    } else {
      this.items = this.notFilteredItems;
    }

  },
  async created() {
    this.itemTypeId = +this.$route.query.type_id;
    this.startDate = this.$route.query.start_date;
    this.duration = this.$route.query.duration;
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
