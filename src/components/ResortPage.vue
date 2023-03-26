<template>
  <div class="results">
    <div class="filters">
      <div class="filters__date-input date-input">
        <label for="startDate">Дата:</label>
        <input type="date" class="form-control" id="startDate" v-model="sel_date">
      </div>

      <div class="filters__type type">
        <label for="typeInput">Тип инвентаря</label>
        <select class="form-control" id="typeInput" v-model="selectedType">
          <option v-for="type in types" :key="type.id" :value="type">{{ type.name }}</option>
        </select>
      </div>

      <div class="select-time">
        <div class="select-time__start">
          <label for="startTime">Начало бронирования:</label>
          <select name="startTime" id="startTime" v-model="startTime" class="form-control">
            <option value="00">0:00</option>
            <option value="01">1:00</option>
            <option value="02">2:00</option>
            <option value="03">3:00</option>
            <option value="04">4:00</option>
            <option value="05">5:00</option>
            <option value="06">6:00</option>
            <option value="07">7:00</option>
            <option value="08">8:00</option>
            <option value="09">9:00</option>
            <option value="10">10:00</option>
            <option value="11">11:00</option>
            <option value="12">12:00</option>
            <option value="13">13:00</option>
            <option value="14">14:00</option>
            <option value="15">15:00</option>
            <option value="16">16:00</option>
            <option value="17">17:00</option>
            <option value="18">18:00</option>
            <option value="19">19:00</option>
            <option value="20">20:00</option>
            <option value="21">21:00</option>
            <option value="22">22:00</option>
            <option value="23">23:00</option>
          </select>
        </div>
        <div class="select-time__end">
          <label for="endTime">Конец бронирования:</label>
          <select name="startTime" id="endTime" v-model="endTime" class="form-control">
            <option value="00">0:00</option>
            <option value="01">1:00</option>
            <option value="02">2:00</option>
            <option value="03">3:00</option>
            <option value="04">4:00</option>
            <option value="05">5:00</option>
            <option value="06">6:00</option>
            <option value="07">7:00</option>
            <option value="08">8:00</option>
            <option value="09">9:00</option>
            <option value="10">10:00</option>
            <option value="11">11:00</option>
            <option value="12">12:00</option>
            <option value="13">13:00</option>
            <option value="14">14:00</option>
            <option value="15">15:00</option>
            <option value="16">16:00</option>
            <option value="17">17:00</option>
            <option value="18">18:00</option>
            <option value="19">19:00</option>
            <option value="20">20:00</option>
            <option value="21">21:00</option>
            <option value="22">22:00</option>
            <option value="23">23:00</option>
          </select>
        </div>
      </div>
    </div>

    <h3 class="items-for-resort-title">Инвентарь в "{{ resortName }}":</h3>
    <ul v-if="items.length > 0" class="items-for-resort-list">
      <equipment-item v-for="item in filteredItems"
                      class="items-for-resort-item"
                      :key="item.id"
                      :item="item"
                      :types="types"
                      :typeId="item.type_id"
                      :resortName="resortName"
                      :editMode="false"
                      :sel_date="sel_date"
                      :startTime="startTime"
                      :endTime="endTime"
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
    this.startTime = this.$route.query.startTime;
    this.endTime = this.$route.query.endTime;
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
.results {
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
}

.filters {

  margin: 0 auto 30px;

  padding: 1rem;
  width: 30vw;
}

.date-input, .type, .select-time {
  width: 100%;
}

.select-time {
  display: flex;
  justify-content: space-between;
}

.select-time__start, .select-time__end {
  width: 40%;
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

input[type="date"] {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  margin-top: 6px;
  margin-bottom: 16px;
  resize: vertical;
}

@media (max-width: 767px) {
  .items-for-resort-title {
    font-size: 1.25rem;
  }

  .filters {
    width: 50vw;
  }
}

input[type="date"], input[type="number"], select {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  margin-top: 6px;
  margin-bottom: 16px;
  resize: vertical;
}
</style>
