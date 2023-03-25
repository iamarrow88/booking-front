<template>
  <div>
    <h1>Бронирование спортивного инвентаря</h1>
    <p>Забронируйте свой любимый спортивный инвентарь онлайн!</p>
    <div class="container my-5">
      <div class="form-group">
        <label for="Date">Дата:</label>
        <input type="date" class="form-control" id="Date" v-model="sel_date">
      </div>
      <div class="form-group" style="display: flex; justify-content: space-between;">
        <div>
          <label for="startTime">Начало:</label>
            <select name="startTime" id="startTime" v-model="startTime">
              <option value="00">0:00</option>
              <option value="01">1:00</option>
              <option value="02">2:00</option>
              <option value="03">3:00</option>
              <option value="4">4:00</option>
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
        <div>
          <label for="endTime">Конец:</label>
          <select name="endTime" id="endTime" v-model="endTime">
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
        <h3>Resorts in {{ selectedCity.name }}:</h3>
        <ul class="list-group">
          <li class="list-group-item" v-for="resort in resorts" :key="resort.id">{{ resort.name }}
            <p class="my-2">Адрес: {{ resort.address }}</p>
            <p class="my-2">Описание: {{ resort.description }}</p>

            <button
                @click="$router.push({ path: '/resorts/' + resort.id, query:
                 {
                  type_id: selectedType.id,
                  selectedCityId: selectedCity.id,
                  sel_date: sel_date,
                  startTime: startTime,
                  endTime: endTime,
                 }
                })">
              See
              Items
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
      sel_date: null,
      startTime: '',
      endTime: '',
      selectedCity: null,
      selectedType: null,
      cities: [],
      resorts: [],
      types: [],
      isNotFoundShown: false,
      startDate: null,
      todayDate: null,
    }
  },
  methods: {
    async getResorts() {
      console.log(`Getting resorts for ${this.selectedCity.name}`);
      const startTime = this.startTime + ':00:00';
      const endTime = this.endTime + ':00:00';
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
            start_time: this.sel_date + 'T' + startTime + '.000Z',
            end_time: this.sel_date + 'T' + endTime + '.000Z',
          })
        });
        this.resorts = await response.json()
        console.log(`Found ${this.resorts.length} resorts in ${this.selectedCity.name}`);
        this.isNotFoundShown = this.resorts.length === 0;
      } catch (error) {
        console.error(error)
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
    this.startDate = new Date(new Date().setHours(0, 0, 0, 0));
    this.todayDate = new Date();
    this.selectedCity = this.cities[0];
    this.selectedType = this.types[0];
    this.sel_date = (new Date().toISOString().slice(0, 10));
    let startTime = (+this.todayDate.toString().split(':')[0].slice(-3) + 1).toString();
    startTime = startTime.length === 1 ? '0' + startTime : startTime;
    startTime = startTime === '24' ? '00' : startTime;
    this.startTime = startTime;

  },
  watch: {
    startTime(newTime) {
      const MsInHour = 60 * 60 * 1000;
      const hoursToAdd = (+newTime + 1) * MsInHour;
      let endTime = +new Date(Date.parse(this.startDate) + hoursToAdd).toString().split(':')[0].slice(-2);
      this.endTime = endTime.toString().length === 1 ? '0' + endTime : endTime.toString();
    }
  }
}
</script>


<style scoped>
.container {
  width: 50%;
  margin: 0 auto;
}

.container {
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

.form-container {
  border-radius: 5px;
  background-color: #f2f2f2;
  padding: 20px;
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
  margin: 0 auto;
  margin-top: 15px;
  padding: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  overflow: hidden;

}

button {
  padding: 10px;
}

</style>
