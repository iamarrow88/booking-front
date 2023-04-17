<template>
  <div class="results">
    <div class="filters">
      <div class="filters__date-input date-input">
        <label for="startDate">Дата с:</label>
        <input type="date" class="form-control" id="startDate" v-model="selDateStartShort" ref="dateStart">
        <label for="Date">Дата по:</label>
        <input type="date" class="form-control" id="dateEnd" v-model="selDateEndShort" ref="dateEnd">
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
          <select name="startTime" id="startTime" v-model="startTime" class="form-control" ref="startTime">
<!--            <option value="01">1:00</option>
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
            <option value="24">24:00</option>-->
          </select>
        </div>
        <div class="select-time__end">
          <label for="endTime">Конец бронирования:</label>
          <select name="endTime" id="endTime" v-model="endTime" class="form-control" ref="endTime">
<!--            <option value="01">1:00</option>
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
            <option value="24">24:00</option>-->
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
                      :selDateStartShort="selDateStartShort"
                      :selDateEndShort="selDateEndShort"
                      :startTime="startTime"
                      :endTime="endTime"
                      :duration="duration"
                      :hoursNaming="hoursNaming"
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
      items: [],
      types: [],
      notFilteredItems: [],
      filteredItems: [],

      itemTypeId: null,
      selectedType: null,
      resortName: '',

      selDateStartShort: null,
      selDateEndShort: null,
      todayDateFull: null,

      startTime: '',
      endTime: '',
      duration: null,
      hoursNaming: 'час',
      isToday: '',

      startCounter: 0,
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
    getTimeNumber(dateFull) {
      let timeNumber = (+dateFull.toString().split(':')[0].slice(-3) + 1).toString();
      timeNumber = timeNumber.length === 1 ? '0' + timeNumber : timeNumber;
      return timeNumber;
    },
    getShortDate(fullDate) {
      return (fullDate.toISOString().slice(0, 10));
    },
    addDayToDate(dateFull, daysToAdd){
      return new Date(dateFull.setDate(new Date().getDate() + daysToAdd)).toISOString().slice(0, 10);
    },
    createStartOptions(startTime, isToday) {
      const startTimeBlock = document.querySelector('#startTime');
      const nowHour = this.todayDateFull.getHours();
      startTimeBlock.innerHTML = '';

      let i = isToday ? startTime : 0;
      for (i; i < 24; i ++) {
        const item = document.createElement('option');
        item.value = i < 10 ? '0' + i : i;
        item.innerHTML = (i < 10 ? '0' + i : i) + ':00';
        if(isToday && nowHour > i) item.setAttribute('disabled', 'true');
        startTimeBlock.appendChild(item);
      }
    },
    createEndOptions(startTime) {
      const endTimeBlock = document.querySelector('#endTime');
      endTimeBlock.innerHTML = '';

      for (let i = +startTime + 1; i < 25; i++) {
        const item = document.createElement('option');
        item.value = i < 10 ? '0' + i : i;
        item.innerHTML = (i < 10 ? '0' + i : i) + ':00';
        endTimeBlock.appendChild(item);
      }
    },
    calcDuration(){
      const msPerHours = 60 * 60 * 1000;
      const start = new Date(this.selDateStartShort + ' ' + this.startTime + ':00:00');
      const end = new Date(this.selDateEndShort + ' ' + this.endTime + ':00:00');
      return (end - start) / msPerHours
    },
    calcHoursNaming(duration){
      console.log('here');
      if(duration >= 5 && duration <= 20 || +duration.toString()[0] >= 5 && +duration.toString()[0] <= 9){
        this.hoursNaming = 'часов';
      } else if(+duration.toString()[0] === 1){
        this.hoursNaming = 'час';
      } else {
        this.hoursNaming = 'часа';
      }
    }
  },
  watch: {
    selectedType: {
      deep: true,
      handler: function (newValue) {
        this.filteredItems = this.notFilteredItems.filter(item => item.type_id === newValue.id)

      }
    },
    duration(newDuration){
      this.calcHoursNaming(newDuration);
    },
    startTime(newTime) {
      if(this.startCounter !== 0) {
        this.endTime = (+this.startTime + 1) < 10 ? '0' + (+this.startTime + 1) : (+this.startTime + 1);
      }
      if(this.endTime > 24) {
        const MsInHour = 60 * 60 * 1000;
        const hoursToAdd = (+newTime + 1) * MsInHour;
        let endTime = +new Date(Date.parse(this.startDateFull) + hoursToAdd).toString().split(':')[0].slice(-2);
        this.endTime = endTime.toString().length === 1 ? '0' + endTime : endTime.toString();
        this.selDateEndShort = this.addDayToDate(this.todayDateFull, 1);
      }
      this.createEndOptions(newTime);
      this.duration = this.calcDuration();
      this.calcHoursNaming(this.duration);
    },
    endTime() {
      this.duration = this.calcDuration();
      this.calcHoursNaming(this.duration);
    },
    selDateEndShort() {
      this.duration = this.calcDuration();
      this.calcHoursNaming(this.duration);
    },
    selDateStartShort(newDate) {
      if(newDate !== this.todayShortDate) {
        document.querySelector('#dateEnd').setAttribute('min', this.selDateStartShort);
        if(this.startCounter !== 0) {
          this.startTime = '10';
          this.selDateEndShort = newDate;
        }
        this.createStartOptions(this.startTime, false);
        this.createEndOptions(this.startTime);
      }
      this.duration = this.calcDuration();
      this.calcHoursNaming(this.duration);
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
    this.selDateStartShort = this.$route.query.selDateStartShort;
    this.selDateEndShort = this.$route.query.selDateEndShort;
    this.startTime = this.$route.query.startTime;
    this.endTime = this.$route.query.endTime;
    this.duration = this.$route.query.duration;
    this.todayDateFull = new Date();
    this.isToday = this.getShortDate(this.todayDateFull) === this.selDateStartShort;
    try {
      const types = await fetch('/api/inventories/types')
      this.types = await types.json();
    } catch (error) {
      console.error(error)
    }
    this.createStartOptions(this.startTime, this.isToday);
    this.createEndOptions(this.startTime);
    this.$refs.dateStart.setAttribute('min', this.todayShortDate);
    this.$refs.dateEnd.setAttribute('min', this.selDateStartShort);
  },

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
