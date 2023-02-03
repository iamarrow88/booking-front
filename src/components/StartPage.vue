<template>
  <div>
    <h1>Sports Equipment Booking</h1>
    <p>Book your favorite sports equipment online!</p>
    <div class="container">
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
        <ul>
          <li v-for="resort in resorts" :key="resort.id">{{ resort.name }}
            <router-link :to="{ path: '/resorts/' + resort.id }" class="btn btn-primary">See Items</router-link>
          </li>
        </ul>
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
      types: []
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
            type_id: this.selectedType.id
          })
        });
        this.resorts = await response.json()
        console.log(`Found ${this.resorts.length} resorts in ${this.selectedCity.name}`)
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

  }
}
</script>
<!--
<template>
  <div class="main">
    <div id="app">
      <div id="v-model-select-dynamic" class="demo">
        <select v-model="city_id">
          <option v-for="item in cities" v-bind:key="item.id">
            {{ item.name }}
          </option>
        </select>
      </div>
      <Datepicker v-model="date" range ></Datepicker>

      <span>Выбрано: {{ city_id }} Дата: {{ data_start }}</span>
    </div>
    <button @click="findResortsByCityID">Найти</button>
    <div id="resorts">
      <div v-for="resort in resorts" v-bind:key="resort.id">
        <div>{{ resort.name }}</div>
        <div>{{ resort.description }}</div>
      </div>
    </div>
  </div>

</template>


<script>
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import {ref, onMounted} from 'vue';

export default {
  setup() {
    const date = ref(new Date());

    // For demo purposes assign range from the current date
    onMounted(() => {
      const startDate = new Date();
      date.value = [startDate];
    })

    return {
      date,
    }
  },
  components: {
    Datepicker
  },


  data() {
    return {
      city_id: null,
      info: null,
      cities: [],
      error: null,
      resorts: [],
      city_id_selected: null,
    }
  },
  mounted() {
    fetch('http://localhost:8081/api/cities')
        .then(response => response.json())
        .then(json => {
          this.cities = json;
        })
        .catch(error => {
          this.error = error;
        });
  },
  methods: {
    greet(event) {
      // `this` inside methods points to the current active instance
      alert(`Hello ${this.name}!`)
      // `event` is the native DOM event
      if (event) {
        alert(event.target.tagName)
      }
    },
    findResortsByCityID() {
      for (var i in this.cities) {
        if (this.cities[i].name === this.city_id) {
          this.city_id_selected = this.cities[i].id;
        }
      }


      // Simple POST request with a JSON body using fetch
      const requestOptions = {
        method: "GET",
        headers: {
          //  "Accept": "application/json",
          //  "Content-Type": "application/json",
          //  "Access-Control-Allow-Headers": "*",
          //  "Connection": "keep-alive",
          //   "Accept-Encoding": "gzip, deflate, br",
          //   "Access-Control-Allow-Credentials": "true",

        },
        // body: JSON.stringify({ title: "Vue POST Request Example" })
      };
      fetch("http://localhost:8081/api/resorts/city/" + this.city_id_selected, requestOptions
      )
          .then(response => response.json())
          .then(data => (this.resorts = data));
    }
  }
}
</script>

&lt;!&ndash; Add "scoped" attribute to limit CSS to this component only &ndash;&gt;
<style scoped>
h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

.demo {
  display: flex;
  flex-flow: row;
  align-items: center;
  flex-grow: 1;
}


</style>

-->
