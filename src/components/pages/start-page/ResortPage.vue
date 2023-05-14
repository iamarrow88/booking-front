<template>
  <div class="resort-page">
    <div class="resort-name">Курорт {{ resortName }}</div>
    <div class="filters">
      <div class="filters__img">
        <img src="../../../assets/3.jpg" alt="forest">
      </div>
      <div class="filters__wrapper">
        <div class="filters__date date">
          <div class="date__block">
            <label for="startDate" class="date__label">Дата с:</label>
            <input type="date"
                   class="date__input"
                   id="startDate"
                   v-model="selDateStartShort"
                   ref="dateStart">
          </div>
          <div class="date__block">
            <label for="dateEnd" class="date__label">Дата по:</label>
            <input type="date"
                   class="date__input"
                   id="dateEnd"
                   v-model="selDateEndShort"
                   ref="dateEnd">
          </div>
        </div>

        <div class="filters__time time">
          <div class="time__start">
            <label for="startTime" class="time__label">Начало бронирования:</label>
            <select name="startTime"
                    id="startTime"
                    v-model="startTime"
                    class="time__select"
                    ref="startTime">
            </select>
          </div>
          <div class="time__end">
            <label for="endTime" class="time__label">Конец бронирования:</label>
            <select name="endTime"
                    id="endTime"
                    v-model="endTime"
                    class="time__select"
                    ref="endTime">
            </select>
          </div>
        </div>

        <div class="filters__type type">
          <label for="typeInput" class="type__label">Тип инвентаря</label>
          <select class="type__select" id="typeInput" v-model="selectedType">
            <option v-for="type in GET_INVENTORY_TYPES"
                    :key="type.id"
                    :value="type"
                    class="type__option">{{ type.name }}
            </option>
          </select>
        </div>


      </div>
    </div>


    <div class="results" ref="results">
      <h3 class="results__title">Инвентарь в "{{ resortName }}":</h3>
      <div class="results__wrapper" v-if="items.length > 0">
        <div class="results__grid">
          <search-equipment-item v-for="item in filteredItems"
                                 class="results__item"
                                 :key="item.id"
                                 :item="item"
                                 :typeId="item.type_id"
                                 :resortName="resortName"
                                 :editMode="false"
                                 :selDateStartShort="selDateStartShort"
                                 :selDateEndShort="selDateEndShort"
                                 :startTime="startTime"
                                 :endTime="endTime"
                                 :duration="duration"
                                 :hoursNaming="hoursNaming">
          </search-equipment-item>
        </div>
      </div>      <div v-else class="results__empty-list-error">
        Ничего не найдено
      </div>
    </div>
  </div>
</template>

<script>
import SearchEquipmentItem from "@/components/items/equipments/SearchEquipmentItem.vue";
import {mapGetters} from "vuex";

export default {
  components: SearchEquipmentItem,
  data() {
    return {
      items: [],
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
      startDateCounter: 0,
    }
  },
  watch: {
    selectedType: {
      deep: true,
      handler: function (newValue) {
        this.filteredItems = this.notFilteredItems.filter(item => item.type_id === newValue.id)

      }
    },
    duration(newDuration) {
      this.calcHoursNaming(newDuration);
    },
    startTime(newTime) {
      if (this.startCounter !== 0) {
        this.endTime = (+this.startTime + 1) < 10 ? '0' + (+this.startTime + 1) : (+this.startTime + 1).toString();
      } else {
        this.startCounter += 1;
      }
      if (+this.endTime > 24) {
        const MsInHour = 60 * 60 * 1000;
        const hoursToAdd = (+newTime + 1) * MsInHour;
        let endTime = new Date(Date.parse(this.startDateFull) + hoursToAdd).toString().split(':')[0].slice(-2);
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
      if (newDate !== this.todayShortDate) {
        document.querySelector('#dateEnd').setAttribute('min', this.selDateStartShort);
        if (this.startDateCounter !== 0) {
          this.startTime = '10';
          this.selDateEndShort = newDate;
          this.createStartOptions(this.startTime, false);
        } else {
          this.createStartOptions(this.startTime, true);
          this.startDateCounter += 1;
        }
        this.createEndOptions(this.startTime);
      }
      this.duration = this.calcDuration();
      this.calcHoursNaming(this.duration);
    },
  },
  computed: {
    ...mapGetters(['GET_INVENTORY_TYPES']),
  },
  methods: {
    getEquipmentType() {
      this.GET_INVENTORY_TYPES.forEach(type => {
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
    addDayToDate(dateFull, daysToAdd) {
      return new Date(dateFull.setDate(new Date().getDate() + daysToAdd)).toISOString().slice(0, 10);
    },
    createStartOptions(startTime, isToday) {
      const startTimeBlock = document.querySelector('#startTime');
      const nowHour = this.todayDateFull.getHours();
      startTimeBlock.innerHTML = '';

      let i = isToday ? startTime : 0;
      for (i; i < 24; i++) {
        const item = document.createElement('option');
        item.value = i < 10 ? '0' + +i : +i;
        item.innerHTML = (i < 10 ? '0' + +i : +i) + ':00';
        if (isToday && nowHour > i) item.setAttribute('disabled', 'true');
        startTimeBlock.appendChild(item);
      }
    },
    createEndOptions(startTime) {
      const endTimeBlock = document.querySelector('#endTime');
      endTimeBlock.innerHTML = '';

      for (let i = +startTime + 1; i < 25; i++) {
        const item = document.createElement('option');
        item.value = i < 10 ? '0' + +i : +i;
        item.innerHTML = (i < 10 ? '0' + +i : +i) + ':00';
        endTimeBlock.appendChild(item);
      }
    },
    calcDuration() {
      const msPerHours = 60 * 60 * 1000;
      const start = new Date(this.selDateStartShort + ' ' + this.startTime + ':00:00');
      const end = new Date(this.selDateEndShort + ' ' + this.endTime + ':00:00');
      return (end - start) / msPerHours
    },
    calcHoursNaming(duration) {
      if (duration >= 5 && duration <= 20 || +duration.toString()[0] >= 5 && +duration.toString()[0] <= 9) {
        this.hoursNaming = 'часов';
      } else if (+duration.toString()[0] === 1) {
        this.hoursNaming = 'час';
      } else {
        this.hoursNaming = 'часа';
      }
    }
  },
  async mounted() {
    this.itemTypeId = +this.$route.query.type_id;
    this.selDateStartShort = this.$route.query.selDateStartShort;
    this.selDateEndShort = this.$route.query.selDateEndShort;
    this.startTime = this.$route.query.startTime;
    this.endTime = this.$route.query.endTime;
    this.duration = this.$route.query.duration;
    this.todayDateFull = new Date();
    this.isToday = this.getShortDate(this.todayDateFull) === this.selDateStartShort;
    this.createStartOptions(this.startTime, this.isToday);
    this.createEndOptions(this.startTime);
    this.$refs.dateStart.setAttribute('min', this.todayShortDate);
    this.$refs.dateEnd.setAttribute('min', this.selDateStartShort);
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
      setTimeout(() => {
        const resultsBlock = this.$refs.results;
        resultsBlock.scrollIntoView({behavior: "smooth", block: "start"});
      }, 1)
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
}
</script>

<style>

input, select, option {
  margin: 0;
  padding: 0;
}


.resort-page {
  margin: 0 auto;
  padding: 3rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  width: 90vw;
}

.resort-name {
  margin-bottom: 30px;
  text-align: left;
  font-size: 36px;
  font-weight: 900;
}

.filters {
  margin-bottom: 50px;
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.filters__img {
  width: 50%;
}

.filters__img img {
  width: 100%;
}

.filters__wrapper {
  width: 45%;
}

.filters__wrapper > div {
  margin: 0 auto 15px;
  width: 80%;
}

.date, .time {
  display: flex;
  justify-content: space-between;

}

label.date__label, label.time__label, label.type__label {
  margin-bottom: 10px;
}

.date > .date__block > input {
  resize: none;
}

.date__block, .time > div {
  width: 45%;
}

.time > div select {
  border-right: auto;
}

.results {
  width: 100%;
}

.results__title {
  font-size: 26px;
  margin-bottom: 50px;
}


.results__wrapper {
  margin: 0 auto;
}

.results__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  grid-gap: 16px;
}

.results__item {
  padding: 1em;
}

@media (max-width: 767px) {

  .results__item {
    width: 25%;
  }

  .resort-page {
    font-size: 1rem;
  }

}

</style>
