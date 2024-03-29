<template>
  <div class="start-page">
    <div class="search-block">
      <h1 class="search-block__header">Бронирование спортивного инвентаря</h1>
      <p class="search-block__subheader">Забронируйте свой любимый спортивный инвентарь онлайн!</p>
      <div class="filters-wrapper">
        <div class="form-group form-group-dates">
          <div class="dates__item">
            <label for="date-start" class="form-title">Дата с:</label>
            <input type="date" class="form-input" id="date-start" v-model="selDateStartShort" ref="dateStart">
          </div>
          <div class="dates__item">
            <label for="date-end" class="form-title">Дата по:</label>
            <input type="date" class="form-input" id="date-end" v-model="selDateEndShort" ref="dateEnd">
          </div>
        </div>
        <div class="form-group form-group-time">
          <div class="drop-list">
            <label for="startTime" class="form-title">Начало:</label>
            <select name="startTime" id="startTime" v-model="startTime" class="time-picker" ref="startTimeBlock">
            </select>
          </div>
          <div class="drop-list">
            <label for="endTime" class="form-title">Конец:</label>
            <select name="endTime" id="endTime" v-model="endTime" class="time-picker" ref="endTimeBlock">
            </select>
          </div>
        </div>
        <div class="form-group form-group-options">
          <div class="form-group form-group-city">
            <label for="city" class="form-title">Город:</label>
            <select class="form-select" id="city" v-model="selectedCity">
              <option class="form-option"
                      v-for="city in GET_CITIES"
                      :key="city.id"
                      :value="city">{{ city.name }}
              </option>
            </select>
          </div>
          <div class="form-group form-group-type">
            <label for="typeItem" class="form-title">Тип инвентаря:</label>
            <select class="form-select" id="typeItem" v-model="selectedType">
              <option class="form-option"
                      v-for="type in GET_INVENTORY_TYPES"
                      :key="type.id"
                      :value="type">{{ type.name }}
              </option>
            </select>
          </div>
        </div>

        <div class="form-group form-group-submit">
          <button @click="getResorts" class="btn-search">Поиск курорта</button>
        </div>
      </div>
    </div>
    <div ref="results">
      <div v-if="resorts.length > 0" class="results-block">
        <h3 class="results-header">Курорты в городе {{ selectedCity.name }}:</h3>
        <div class="results__grid">
          <result-item-from-start-page v-for="resort in resorts"
                                       :key="resort.id"
                                       :resort="resort"
                                       :selectedType="selectedType"
                                       :selectedCity="selectedCity"
                                       :selDateStartShort="selDateStartShort"
                                       :selDateEndShort="selDateEndShort"
                                       :startTime="startTime"
                                       :endTime="endTime"
                                       :duration="duration"
                                       :rate="resort.rate"/>
        </div>
      </div>
      <div v-else-if="isNotFoundShown" class="results-none">
        Ничего на найдено, попробуйте другой город или другое снаряжение
      </div>
    </div>
    <div class="results" id="results"></div>
  </div>
</template>

<script>
import ResultItemFromStartPage from "@/components/items/start-page/ResultItemFromStartPage.vue";
import {mapActions, mapGetters} from "vuex";

export default {
  name: "StartPage",
  components: ResultItemFromStartPage,
  data() {
    return {
      startDateFull: null,
      todayDateFull: null,
      todayShortDate: null,

      selDateStartShort: null,
      selDateEndShort: null,

      startTime: null,
      endTime: '',
      duration: '',
      hoursNaming: 'час',

      selectedCity: null,
      selectedType: null,

      resorts: [],

      isNotFoundShown: false,
      isMoreShown: false,
    }
  },
  watch: {
    startTime(newTime) {
      this.endTime = (+this.startTime + 1) < 10 ? '0' + (+this.startTime + 1) : (+this.startTime + 1).toString();
      if (+this.endTime > 24) {
        const MsInHour = 60 * 60 * 1000;
        const hoursToAdd = (+newTime + 1) * MsInHour;
        let endTime = new Date(Date.parse(this.startDateFull) + hoursToAdd).toString().split(':')[0].slice(-2);
        this.endTime = endTime.toString().length === 1 ? '0' + endTime : endTime.toString();
        this.selDateEndShort = new Date(this.todayDateFull.setDate(new Date().getDate() + 1)).toISOString().slice(0, 10);
      }
      this.checkStartTime();
      this.createEndOptions(newTime);
      this.duration = this.calcDuration();
      this.calcHoursNaming(this.duration);
      this.$store.commit('setStartTime', this.startTime);
      this.$store.commit('setEndTime', this.endTime);
    },
    endTime() {
      this.calcHoursNaming(this.duration);
      this.createEndOptions('00');
      this.$store.commit('setEndTime', this.endTime);
      this.duration = this.calcDuration();
    },
    selDateEndShort() {
      this.duration = this.calcDuration();
      this.calcHoursNaming(this.duration);
      this.$store.commit('setEndDate', this.selDateEndShort);
    },
    selDateStartShort(newDate) {
      if (newDate !== this.todayShortDate) {
        this.$refs.dateEnd.setAttribute('min', this.selDateStartShort);
        this.startTime = '10';
        this.selDateEndShort = newDate;
        this.createStartOptions(this.startTime, false);
        this.createEndOptions(this.startTime);
      }
      this.$store.commit('setStartDate', this.selDateStartShort);
      this.duration = this.calcDuration();
      this.calcHoursNaming(this.duration);

    },
    selectedType(newInvType) {
      this.$store.commit('setSelectedInvType', newInvType);
    }
  },
  computed: {
    ...mapGetters(['GET_INVENTORY_TYPES', 'GET_CITIES']),
  },
  methods: {
    ...mapActions(['fetchCities', 'fetchInventoryTypes']),
    getTimeNumber(dateFull) {
      let timeNumber = (+dateFull.toString().split(':')[0].slice(-3) + 1).toString();
      timeNumber = timeNumber.length === 1 ? '0' + timeNumber : timeNumber;
      return timeNumber;
    },
    getShortDate(fullDate) {
      return (fullDate.toISOString().slice(0, 10));
    },
    addDayToDate(dateFull, dateType, daysToAdd) {
      let date = dateType === 'short' ? new Date(dateFull) : dateFull;
      return new Date(date.setDate(new Date().getDate() + daysToAdd)).toISOString().slice(0, 10);
    },
    createStartOptions(startTime, isToday) {
      const startTimeBlock = this.$refs.startTimeBlock;
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
      const endTimeBlock = this.$refs.endTimeBlock;
      endTimeBlock.innerHTML = '';

      for (let i = +startTime + 1; i < 25; i++) {
        const item = document.createElement('option');
        item.value = i < 10 ? '0' + +i : +i;
        item.innerHTML = (i < 10 ? '0' + +i : +i) + ':00';
        endTimeBlock.appendChild(item);
      }
    },
    async getResorts() {
      const startTime = this.startTime + ':00:00';
      const endTime = +this.endTime === 24 ? '00:00:00' : this.endTime + ':00:00';
      const endDate = +this.endTime === 24 ? this.addDayToDate(this.selDateEndShort, 'short', 1) : this.selDateEndShort;

      const body = {
        city_id: +this.selectedCity.id,
        type_id: +this.selectedType.id,
        start_time: this.selDateStartShort + 'T' + startTime + '.000Z',
        end_time: endDate + 'T' + endTime + '.000Z',
      }
      console.log(body);

      console.log(`Getting resorts for ${this.selectedCity.name}`);

      try {
        const response = await fetch('/api/resorts/filter', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': '*'
          },
          body: JSON.stringify(body)
        });
        if (response.ok) {
          this.resorts = await response.json();
          console.log(`Found ${this.resorts.length} resorts in ${this.selectedCity.name}`);
          this.isNotFoundShown = this.resorts.length === 0;
          setTimeout(() => {
            this.scrollToResults();
          }, 1)

        } else {
          console.log('не ок');
        }
      } catch (error) {
        console.error(error)
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
    },
    checkStartTime() {
      if (+this.startTime === 24) {
        this.selDateStartShort = this.addDayToDate(this.todayShortDate, 'short', 1);
      }
    },
    scrollToResults() {
      const resultsBlock = this.$refs.results;
      resultsBlock.scrollIntoView({behavior: "smooth", block: "start"});
    }
  },
  async mounted() {
    this.selDateStartShort = this.getShortDate(new Date());
    this.startDateFull = new Date(new Date(this.selDateStartShort).setHours(0, 0, 0, 0));
    this.todayDateFull = new Date();
    this.selDateEndShort = this.selDateStartShort;
    this.startTime = this.getTimeNumber(this.todayDateFull);
    this.todayShortDate = (new Date().toISOString().slice(0, 10));
    this.checkStartTime();
    this.createStartOptions(this.startTime, true);
    this.createEndOptions(this.startTime);
    this.$refs.dateStart.setAttribute('min', this.todayShortDate);
    this.$refs.dateEnd.setAttribute('min', this.selDateStartShort);
    await this.fetchInventoryTypes();
    await this.fetchCities();
    this.selectedCity = this.GET_CITIES[0];
    this.selectedType = this.GET_INVENTORY_TYPES[0];
  },
}
</script>


<style scoped>

.start-page {
  width: 100vw;
}

.search-block {
  padding: 50px 50px 0;
  background-image: url("../../../assets/11.jpg");
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  text-align: center;
}

.search-block__header, .search-block__subheader {
  color: #fff;
}

.filters-wrapper {
  width: 50%;
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

.form-group {
  display: flex;
  justify-content: space-between;
}

.form-group-dates, .form-group-time {
  gap: 20px;
}

.form-group-time {
  margin-bottom: 45px;
}

.dates__item {
  width: 17vw;
  max-width: 300px;
}

.dates__item > input {
  resize: none;
}

.drop-list {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  width: 17vw;
  max-width: 300px;
}

.drop-list label {
  width: 100%;
}

.time-picker {
  width: 10vw;
}

.time-picker option {
  width: 10vw;
}

.drop-list select {
  width: 100%;
}

.form-group-options {
  display: flex;
  flex-direction: column;
}

.form-group-city {
  margin-bottom: 45px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
}

.form-group-city select, .form-group-type select {
  margin: 0;
  width: 19vw;
}

.form-group-city label, .form-group-type label {
  margin: 0;
  align-self: end;
  text-align: left;
}

.form-group-submit {
  display: flex;
  justify-content: center;
}

.btn-search {
  padding: 15px 20px;
}

.results-block {
  padding-top: 40px;
  margin: 0 auto;
  width: 80%;
}

.results-header {
  margin-bottom: 35px;
  font-size: 2em;
}

.results__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  justify-items: center;
  grid-gap: 2%;
  padding: 3%;

}

.form-title {
  color: #fff;
  font-weight: 600;
}

@media (max-width: 860px) {
  .form-group-dates, .form-group-time {
    flex-direction: column;
    width: 100%;
  }

  .form-group-dates > div, .form-group-time > div {
    margin: 0 auto;
    width: 100%;
    max-width: none;
  }

  .form-group-city, .form-group-type {
    display: grid;
    grid-template-columns: 1fr 2fr;
    width: 100%;
  }

  .form-group-city > select, .form-group-type > select {
    width: auto;
  }
}

@media (max-width: 690px) {
  .filters-wrapper {
    width: 100%;
    max-width: none;

  }
}
</style>
