<template>
  <div>
    <h1>Бронирование спортивного инвентаря</h1>
    <p>Забронируйте свой любимый спортивный инвентарь онлайн!</p>
    <div class="container my-5">
      <div class="form-group">
        <label for="Date">Дата с:</label>
        <input type="date" class="form-control" id="date-start" v-model="selDateStartShort">
        <label for="Date">Дата по:</label>
        <input type="date" class="form-control" id="date-end" v-model="selDateEndShort">
      </div>
      <div class="form-group" style="display: flex; justify-content: space-between;">
        <div>
          <label for="startTime">Начало:</label>
            <select name="startTime" id="startTime" v-model="startTime" class="time-picker">
            </select>
        </div>
        <div>
          <label for="endTime">Конец:</label>
          <select name="endTime" id="endTime" v-model="endTime" class="time-picker">
          </select>
        </div>
      </div>
      <div class="duration">Бронь на {{duration}} {{hoursNaming}}</div>
      <div class="form-group">
        <label for="city">Город:</label>
        <select class="form-control" id="city" v-model="selectedCity">
          <option v-for="city in cities" :key="city.id" :value="city">{{ city.name }}</option>
        </select>
        <div class="form-group">
          <label for="typeInput">Тип инвентаря</label>
          <select class="form-control" id="typeInput" v-model="selectedType">
            <option v-for="type in types" :key="type.id" :value="type">{{ type.name }}</option>
          </select>
        </div>
      </div>

      <div class="form-group">
        <button class="btn btn-primary" @click="getResorts">Поиск курорта</button>
      </div>
      <div v-if="resorts.length > 0">
        <h3>Курорты в городе {{ selectedCity.name }}:</h3>
        <ul class="list-group">
          <li class="list-group-item" v-for="resort in resorts" :key="resort.id">{{ resort.name }}
            <p class="my-2">Адрес: {{ resort.address }}</p>
            <p class="my-2">Описание: {{ resort.description }}</p>

            <button
                @click="$router.push({ path: '/resorts/' + resort.id, query:
                 {
                  type_id: selectedType.id,
                  selectedCityId: selectedCity.id,
                  sel_date: selDateStartShort,
                  sel_date_end:selDateEndShort,
                  startTime: startTime,
                  endTime: endTime,
                  duration: duration
                 }
                })">
              Посмотреть инвентарь
            </button>

          </li>
        </ul>
      </div>
      <div v-else-if="isNotFoundShown">
        Ничего на найдено, попробуйте другой город или другое снаряжение
      </div>
    </div>
  </div>
</template>

<script>
export default {
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
    document.querySelector('#date-start').setAttribute('min', this.todayShortDate)
    document.querySelector('#date-end').setAttribute('min', this.selDateStartShort)
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
        document.querySelector('#date-end').setAttribute('min', this.selDateStartShort)
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
.container {
  width: 50%;
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

h1, h3, p {
  text-align: center;
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

input[type="submit"] {
  background-color: #4CAF50;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

input[type="submit"]:hover {
  background-color: #45a049;
}

.time-picker {
  width: 10vw;
}

.time-picker option {
  width: 10vw;
}

li {
  margin-bottom: 10px;
  list-style: none;
}

.btn {
  margin-top: 10px;
}

.list-group {
  max-width: 800px;
  margin: 0 auto;
}

.my-2 {
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.list-group-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 500px;
  margin: 15px auto 0;
  padding: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  overflow: hidden;

}

button {
  padding: 10px;
}

</style>
