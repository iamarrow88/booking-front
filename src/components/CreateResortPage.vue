<template>
  <div class="add-resort">
    <h2>Страница создания карточки курорта</h2>
    <div class="form-block resort-name">
      <label for="ResortName">Введите название курорта</label>
      <input type="text" id="ResortName" v-model="resortName">
    </div>
    <div class="form-block resort-address">
      <label for="resortAddress">Введите адрес курорта</label>
      <select v-model="city">
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
/*import addItem from "@/components/addItem.vue";*/

export default {
  name: "CreateResortPage",
  data() {
    return {
      editMode: false,

      cities: [],
      resorts: [],

      resortId: null,
      cityId: null,

      resortName: '',
      resortAddress: '',
      resortDescription: '',
      city: '',

      userId: null,
      errorMessage: null,

      /*isResortAdded: false,*/
      /*resortToEditId: '',
      resortToEditName: '',
      resortToEditCityId: null,
      resortToEditAddress: '',
      resortToEditDescription: '',*/



/*      isEditOpen: false,*/


    }
  },
  methods: {
    async addResort () {
      try {
        const response = await fetch('/api/resorts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': '*'
          },
          body: JSON.stringify({
                city_id: this.city.id,
                resort_name: this.resortName,
                resort_address: this.resortAddress,
                resort_description: this.resortDescription,
                ID:  this.resortId,
                owner_id: this.$props.userId
              }
          )
        });
        const result = await response.json();
        console.log(result);
        if(result.ok){
          this.resortName = '';
          this.resortAddress = '';
          this.resortDescription = '';
          this.city = this.cities[0].name;
        } else {
          this.errorMessage = "Invalid data provided, please try again";
        }
      } catch (error) {
        console.error(error)
      }
      this.$router.push('/resorts/manage');
      /*await this.getResorts();*/
    },
    async getResorts() {
      try {
        const resorts = await fetch('/api/resorts');
        this.resorts = await resorts.json();

        if(this.editMode){
          this.resorts.forEach(resort => {
            if(resort.id === +this.$route.query.resortId){
              this.resort = resort;
              this.resortName = resort.name;
              this.cityId = resort.city_id;
              this.resortAddress = resort.address;
              this.resortDescription = resort.description;
              }
          })
        }
      } catch (e) {
        console.error(e);
      }
    }
  },
  async created() {
    this.editMode = this.$route.query.editMode;
    this.userId = localStorage.getItem('userId');
    this.resortId = this.$route.query.resortId ? this.$route.query.resortId : new Date();
    await this.getResorts();

    try {
      const cities = await fetch('/api/cities');
      this.cities = await cities.json();
      if(this.editMode) {
        this.cities.forEach(city => {
          console.log(`${city.id} === ${+this.cityId}`);
          if(city.id === +this.cityId) this.city = city.name;
        })
      } else {
        this.city = this.cities[0].name;
      }
    } catch (error) {
      console.error(error)
    }


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