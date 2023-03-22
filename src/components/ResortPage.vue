<template>
  <div class="items-for-resort">

    <div class="form-group" style="display: flex; justify-content: space-between;">
      <div>
        <label for="startDate">Дата:</label>
        <input type="date" class="form-control" id="startDate" v-model="sel_date">
      </div>
      <div>
        <label for="startTime">Начало бронирования:</label>
        <input type="time" class="form-control" id="startTime" v-model="startTime">
      </div>
      <div>
        <label for="endTime">Конец бронирования:</label>
        <input type="time" class="form-control" id="endTime" v-model="endTime">
      </div>
      <div>
        <label for="typeInput">Тип инвентаря</label>
        <select class="form-control" id="typeInput" v-model="selectedType">
          <option v-for="type in types" :key="type.id" :value="type">{{ type.name }}</option>
        </select>
      </div>
    </div>


    <h3 class="items-for-resort-title">Items for {{ resortName }}:</h3>
    <ul v-if="items.length > 0" class="items-for-resort-list">
      <equipment-item v-for="item in filteredItems"
                      :key="item.id"
                      class="items-for-resort-item"
                      v-bind:item="item"
                      v-bind:types="types"
                      :typeId="item.type_id"
                      :pageTypeId="$route"
                      :resortName="resortName"
                      :sel_date="sel_date"
      ></equipment-item>

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
      sel_date: null,
      startTime: '',
      endTime: '',
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
      handler: function (newValue) {
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
    this.sel_date = this.$route.query.sel_date;
    this.startTime = this.$route.query.start_time;
    this.endTime = this.$route.query.end_time;
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
