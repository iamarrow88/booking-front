<template>
  <div class="add-resort">
    <h2>{{ editMode ? "Страница редактирования карточки курорта" : "Страница создания карточки курорта" }}</h2>
    <div class="form-block resort-name">
      <label for="ResortName">Введите название курорта</label>
      <input type="text" id="ResortName" v-model="resortName">
    </div>
    <div class="form-block resort-address">
      <label for="resortAddress">Введите адрес курорта</label>
      <select v-model="cityName">
        <option v-for="city in cities" :key="city.id">{{ city.name }}</option>
      </select>
      <input type="text" id="resortAddress" v-model="resortAddress">
    </div>
    <div class="form-block resort-description">
      <label for="resortDescription">Введите описание курорта</label>
      <input type="text" id="resortDescription" v-model="resortDescription">
    </div>

    <button @click="addResort">{{ editMode ? "Изменить данные курорта" : "Создать карточку курорта" }}</button>

    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script>

export default {
  name: "CreateResortPage",
  props: {
    resortIdFromParent: Number,
    editMode: Boolean,
  },
  data() {
    return {
      cities: [],
      resorts: [],

      resortId: null,
      cityId: null,

      resortName: '',
      resortAddress: '',
      resortDescription: '',
      cityName: '',

      userId: null,
      errorMessage: null,
      isEditComponent: null,
    }
  },
  methods: {
    addResort () {
      console.log('create resort');
      this.$emit('updateResort', this.editMode, this.cityId, this.resortId, this.resortName, this.resortAddress, this.resortDescription, this.userId);
    },
    async getResorts() {
      try {
        const resorts = await fetch('/api/resorts');
        this.resorts = await resorts.json();
      } catch (e) {
        console.error(e);
      }
    }
  },
  async created() {
    this.userId = localStorage.getItem('userId');
    this.isEditComponent = this.editMode;
    this.resortId = this.resortIdFromParent ? this.resortIdFromParent : Date.now();
    await this.getResorts();

    try {
      const cities = await fetch('/api/cities');
      this.cities = await cities.json();
      if(!this.editMode) {
        this.cityName = this.cities[0].name;
        this.cityId = this.cities[0].id
      }
    } catch (error) {
      console.error(error)
    }

    this.resorts.forEach(resort => {
      if(resort.id === this.resortId){
        this.resortName = resort.name;
        this.resortAddress = resort.address;
        this.resortDescription = resort.description;
        this.cityId = resort.city_id;
        this.cities.forEach(city => {
          if(city.id === this.cityId) this.cityName = city.name;
        })
      }
    })
  },
}
</script>

<style scoped>
  input {
    margin: 0 auto;
    max-width: 500px;
  }
  .resort-address, select, option {
    margin: 0 auto;
    max-width: 542px;
  }
  .resort-address select {
    width: 42%;
  }
  .resort-address input {
    width: 50%;
  }
</style>