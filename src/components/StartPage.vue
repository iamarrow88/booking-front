<template>
  <div>
    <h1>Sports Equipment Booking</h1>
    <p>Book your favorite sports equipment online!</p>
    <div class="container my-5">
      <div class="form-group">
        <label for="startDate">Start Date:</label>
        <input type="date" class="form-control" id="startDate" v-model="startDate">
      </div>
      <div class="form-group">
        <label for="city">City:</label>
        <select class="form-control" id="city" v-model="selectedCity">
          <option v-for="city in cities" :key="city.id" :value="city">{{ city.name }}</option>
        </select>
        <div class="form-group">
          <label for="typeInput">Type</label>
          <select class="form-control" id="typeInput" v-model="selectedType">
            <option v-for="type in types" :key="type.id" :value="type">{{ type.name }}</option>
          </select>
        </div>
      </div>
      <div class="form-group">
        <label for="duration">Duration (days):</label>
        <input type="number" class="form-control" id="duration" v-model.number="duration">
      </div>
      <div class="form-group">
        <button class="btn btn-primary" @click="getResorts">Find Resorts</button>
      </div>
      <div v-if="resorts.length > 0">
        <h3>Resorts in {{ selectedCity.name }}:</h3>
        <ul class="list-group">
          <li class="list-group-item" v-for="resort in resorts" :key="resort.id">{{ resort.name }}
            <p class="my-2">Address: {{ resort.address }}</p>
            <p class="my-2">Description: {{ resort.description }}</p>

            <button
                @click="$router.push({ path: '/resorts/' + resort.id, query: { type_id: selectedType.id, start_date: startDate, duration: duration  } })">
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
      startDate: null,
      duration: 1,
      selectedCity: null,
      selectedType: null,
      cities: [],
      resorts: [],
      types: [],
      isNotFoundShown: false,
    }
  },
  methods: {
    async getResorts() {
      console.log(`Getting resorts for ${this.selectedCity.name}`)
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
            start_date: this.startDate,
            duration: this.duration
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
    this.selectedCity = this.cities[0];
    this.selectedType = this.types[0];
    this.startDate = (new Date().getFullYear() + '-' + ('0' + (new Date().getMonth() + 1)).slice(-2) + '-' + ('0' + new Date().getDate()).slice(-2));
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
