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
             <select name="startTime" id="startTime" v-model="startTime" class="time-picker" ref="startTime">
             </select>
           </div>
           <div class="drop-list">
             <label for="endTime" class="form-title">Конец:</label>
             <select name="endTime" id="endTime" v-model="endTime" class="time-picker" ref="endTime">
             </select>
           </div>
         </div>
<!--         <div class="duration form-title">Бронь на {{duration}} {{hoursNaming}}</div>-->
         <div class="form-group form-group-options">
           <div class="form-group form-group-city">
             <label for="city" class="form-title">Город:</label>
             <select class="form-select" id="city" v-model="selectedCity">
               <option class="form-option"
                       v-for="city in cities"
                       :key="city.id"
                       :value="city">{{ city.name }}</option>
             </select>
           </div>
           <div class="form-group form-group-type">
             <label for="typeItem" class="form-title">Тип инвентаря:</label>
             <select class="form-select" id="typeItem" v-model="selectedType">
               <option class="form-option"
                   v-for="type in types"
                   :key="type.id"
                   :value="type">{{ type.name }}</option>
             </select>
           </div>
         </div>

         <div class="form-group form-group-submit">
           <button @click="getResorts" class="btn-search">Поиск курорта</button>
         </div>
       </div>
      </div>
    <div>
      <div v-if="resorts.length > 0" class="results-block">
        <h3 class="results-header">Курорты в городе {{ selectedCity.name }}:</h3>
        <ul class="results-list">
          <result-item-from-start-page v-for="resort in resorts"
                                       :key="resort.id"
          :resort="resort"
          :selectedType="selectedType"
          :selectedCity="selectedCity"
          :selDateStartShort="selDateStartShort"
          :selDateEndShort="selDateEndShort"
          :startTime="startTime"
          :endTime="endTime"
          :duration="duration"></result-item-from-start-page>
        </ul>
      </div>
      <div v-else-if="isNotFoundShown" class="results-none">
        Ничего на найдено, попробуйте другой город или другое снаряжение
      </div>
    </div>
  </div>
</template>

<script>
import ResultItemFromStartPage from "@/components/ResultItemFromStartPage.vue";

export default {
  components: ResultItemFromStartPage,
  data() {
    return {
      startDateFull: null,
      todayDateFull: null,
      todayShortDate: null,

      selDateStartShort: null,
      selDateEndShort: null,

      startTime: '',
      endTime: '',
      duration: null,
      hoursNaming: 'час',

      selectedCity: null,
      selectedType: null,

      cities: [],
      resorts: [],
      types: [],

      isNotFoundShown: false,
      isMoreShown: false,
    }
  },
  methods: {
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
      const startTimeBlock = this.$refs.startTime;
      const nowHour = this.todayDateFull.getHours();

      startTimeBlock.innerHTML = '';

      let i = isToday ? startTime : 0;
      for (i; i < 24; i ++) {
        const item = document.createElement('option');
        item.value = i < 10 ? '0' + +i : +i;
        item.innerHTML = (i < 10 ? '0' + +i : +i) + ':00';
        if(isToday && nowHour > i) item.setAttribute('disabled', 'true');
        startTimeBlock.appendChild(item);
      }
    },
    createEndOptions(startTime) {
      const endTimeBlock = this.$refs.endTime;
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
      const endTime = (this.endTime === 24 ? '23:59:59' : this.endTime + ':00:00');
      console.log(`Getting resorts for ${this.selectedCity.name}`);

      try {
        const response = await fetch('/api/resorts/filter', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': '*'
          },
          body: JSON.stringify({
            city_id: this.selectedCity.id,
            type_id: this.selectedType.id,
            start_time: this.selDateStartShort + 'T' + startTime + '.000Z',
            end_time: this.selDateStartShort + 'T' + endTime + '.000Z',
          })
        });
        this.resorts = await response.json()
        console.log(`Found ${this.resorts.length} resorts in ${this.selectedCity.name}`);
        this.isNotFoundShown = this.resorts.length === 0;
      } catch (error) {
        console.error(error)
      }
    },
    calcDuration(){
     const msPerHours = 60 * 60 * 1000;
     const start = new Date(this.selDateStartShort + ' ' + this.startTime + ':00:00');
     const end = new Date(this.selDateEndShort + ' ' + this.endTime + ':00:00');
      return (end - start) / msPerHours
    },
    calcHoursNaming(duration){
     if(duration >= 5 && duration <= 20 || +duration.toString()[0] >= 5 && +duration.toString()[0] <= 9){
       this.hoursNaming = 'часов';
     } else if(+duration.toString()[0] === 1){
       this.hoursNaming = 'час';
     } else {
       this.hoursNaming = 'часа';
     }
    }
    },
  async created() {
    try {
      const response = await fetch('/api/cities')
      this.cities = await response.json()
      const types = await fetch('/api/inventories/types')
      this.types = await types.json()
    } catch (error) {
      console.error(error)
    }
    this.selDateStartShort = this.getShortDate(new Date());
    this.startDateFull = new Date(new Date(this.selDateStartShort).setHours(0, 0, 0, 0));
    this.todayDateFull = new Date();
    this.selectedCity = this.cities[0];
    this.selectedType = this.types[0];
    this.selDateEndShort = this.selDateStartShort;
    this.startTime = this.getTimeNumber(this.todayDateFull);
    this.createStartOptions(this.startTime, true);
    this.createEndOptions(this.startTime);
    this.todayShortDate = (new Date().toISOString().slice(0, 10));
    this.$refs.dateStart.setAttribute('min', this.todayShortDate);
    this.$refs.dateEnd.setAttribute('min', this.selDateStartShort);
  },
  watch: {
    startTime(newTime) {
      this.endTime = (+this.startTime + 1) < 10 ? '0' + (+this.startTime + 1) : (+this.startTime + 1);
      if(this.endTime > 24) {
        const MsInHour = 60 * 60 * 1000;
        const hoursToAdd = (+newTime + 1) * MsInHour;
        let endTime = +new Date(Date.parse(this.startDateFull) + hoursToAdd).toString().split(':')[0].slice(-2);
        this.endTime = endTime.toString().length === 1 ? '0' + endTime : endTime.toString();
        this.selDateEndShort = new Date(this.todayDateFull.setDate(new Date().getDate() + 1)).toISOString().slice(0, 10);
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
        this.$refs.dateEnd.setAttribute('min', this.selDateStartShort);
        this.startTime = '10';
        this.selDateEndShort = newDate;
        this.createStartOptions(this.startTime, false);
        this.createEndOptions(this.startTime);
      }
      this.duration = this.calcDuration();
      this.calcHoursNaming(this.duration);
    },
  }
}
</script>


<style scoped>

.start-page {
  width: 100vw;
}

.search-block {
  padding: 50px 50px 0;
  background-image: url("../assets/11.jpg");
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

.form-group-dates {
  gap: 20px;
}

.form-input, .time-picker, .form-select{
  background-color: rgba(255, 255, 255, 0.7);
  border-right: 7px;
}

.drop-list {
  display: flex;
  justify-content: space-between;
  align-items: end;
  width: 17vw;
}

.dates__item {
  width: 17vw;
}

/*input[type="date"], input[type="number"], select {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
!*  margin-top: 6px;
  margin-bottom: 16px;*!
  resize: vertical;
}*/

/*input[type="submit"] {
  background-color: #4CAF50;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}*/

/*input[type="submit"]:hover {
  background-color: #45a049;
}*/

.time-picker {
  width: 10vw;
}

.time-picker option {
  width: 10vw;
}

.list-group {
  padding: 40px 80px;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  justify-content: left;
  align-items: stretch;
  max-width: 80vw;
  margin: 0 auto;
}

.btn-search {
  padding: 15px 20px;
}

.results-block {
  padding-top: 40px;
}
.results-header {
  font-size: 28px;
}

.form-title {
  color: #fff;
  font-weight: 600;
}

</style>
