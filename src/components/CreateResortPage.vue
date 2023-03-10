<template>
  <div class="add-resort" v-if="!isResortAdded">
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

    <button @click="addResort">Создать карточку курорта</button>
  </div>

  <div v-else>
<!--    <add-item :resortName="resortName"></add-item>-->
    <select name="resortsList" id="resortsList" v-model="resortToEdit">
      <option v-for="resort in resorts" :key="resort.id">{{ resort.name}}</option>
    </select>
  </div>

</template>

<script>
/*import addItem from "@/components/addItem.vue";*/

export default {
  name: "CreateResortPage",
  /*components: addItem,*/
  data() {
    return {
      resortName: '',
      resortAddress: '',
      resortDescription: '',
      city: '',
      cities: [],
      isResortAdded: false,
      resortToEdit: '',
      resortToEditName: '',
      resorts: [],
    }
  },
  methods: {
    async addResort () {
      this.resortId = new Date();
      try {
        const response = await fetch('/api/resorts', {
          method: 'POST',
          body: JSON.stringify({
                city_id: this.city.id,
                resort_name: this.resortName,
                resort_address: this.resortAddress,
                resort_description: this.resortDescription,
                ID:  this.resortId
              }
          )
        });
        const result = await response.json();
        console.log(result);
        if(result.ok){
          this.resortToEdit = this.resortId;
          this.isResortAdded = true;
          this.resortName = '';
          this.resortAddress = '';
          this.resortDescription = '';
          this.city = this.cities[0].name;
        }
        try {
          const resorts = await fetch('/api/resorts');
          this.resorts = await resorts.json();
          this.resorts.forEach(resort => {
            if(resort.id === this.resortToEdit){
              this.resortToEditName = resort.name;
            }
          })
        } catch (e) {
          console.error(e);
        }
      } catch (error) {
        console.error(error)
      }
    }
  },
  async created() {
    try {
      const cities = await fetch('/api/cities');
      this.cities = await cities.json();
      this.city = this.cities[0].name;
    } catch (error) {
      console.error(error)
    }
  }

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