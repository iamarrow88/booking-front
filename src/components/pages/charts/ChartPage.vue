<template>
  <div class="chart-container">
    <div class="chart-filters">
      <div class="form-group form-group-city">
        <label for="resort" class="form-title">Курорт:</label>
        <select class="form-select" id="resort" v-model="selectedResort">
          <option class="form-option"
                  v-for="resort in resorts"
                  :key="resort.id"
                  :value="resort">{{ resort.name }}
          </option>
        </select>
      </div>
      <div class="form-group form-group-dates">
        <div class="dates__item">
          <label for="date-start" class="form-title">Дата с:</label>
          <input type="date" class="form-input" id="date-start" v-model="shortDateFrom" ref="dateStart">
        </div>
        <div class="dates__item">
          <label for="date-end" class="form-title">Дата по:</label>
          <input type="date" class="form-input" id="date-end" v-model="shortDateTo" ref="dateEnd">
        </div>
        <div class="sort">
          <label for="groupBy">Сортировать по:</label>
          <select name="groupBy" id="groupBy" v-model="groupBy">
            <option value="DAY">дням</option>
            <option value="MONTH">месяцам</option>
            <option value="YEAR">годам</option>
          </select>
        </div>
      </div>

      <button @click="getStats" class="cards-btn">Получить статистику</button>
    </div>
    <div class="chart-data">
      <RenderChart v-if="isLoaded" :chartData="chartData" :chartOptions="chartOptions" />
    </div>
  </div>
</template>

<script>

import {headerWithToken, resorts, stats, inventory} from "@/data-and-functions/constants/URLS";
import RenderChart from "@/components/blocks/charts/RenderCharts.vue";
import {mapActions, mapGetters} from "vuex";

export default {
  name: "ChartPage",
  components: {RenderChart},
  data() {
    return {
      chartData: {
        labels: [ ],
        datasets: [ /*{ data: [40, 20, 12] }*/ ],
      },
      chartOptions: {
        responsive: true
      },
      resorts: [],
      selectedResort: {},
      shortDateFrom: '',
      shortDateTo: '',
      groupBy: 'DAY',
      backgroundColors: ['#f87979', '#c19efd', '#f45', '#d4f879', '#c19edd', '#c19fdd'],
      inventoryColorObj: {},
      inventoriesArray: [],
      datasetsIDObj: {},
      isLoaded: false,
    }
  },
  computed: {
    ...mapGetters(['GET_INVENTORY_TYPES']),
  },
  methods: {
    ...mapActions(['fetchInventoryTypes']),
    async getResorts(){
      const resortsArray= await fetch(resorts.allResorts.URL);
      this.resorts = await resortsArray.json();
      this.selectedResort = this.resorts[3];
    },
    async getInventoryByID(results){
      try {
        for (const inventoryId of this.inventoriesArray) {
            const path = inventory.getInventoriesByID.URL+inventoryId;
            const res = await fetch(path);
            if(res.ok) {
              const result = await res.json();

              if(this.inventoryColorObj[inventoryId]){
                this.inventoryColorObj[inventoryId].inventory = result;
              } else {
                const inventory = {
                  inventory: result,
                  color: '',
                };
                this.inventoryColorObj[inventoryId] = inventory;
              }
            }
        }
      } catch (e) {
        console.log(e);
      }
      return this.setCount(results);
    },
    getShortDate(fullDate) {
      return (fullDate.toISOString().slice(0, 10));
    },
    substratFromDate(dateFull, dateType, daysToSubstrat) {
      let date = dateType === 'short' ? new Date(dateFull) : dateFull;
      return new Date(date.setDate(new Date().getDate() - daysToSubstrat)).toISOString().slice(0, 10);
    },
    getDatesDifference(date1, date2){
      const date1formatted = new Date(date1);
      const date2formatted = new Date(date2);
      const msInDay = 1000* 60 * 60 * 24;
      return (date2formatted - date1formatted) / msInDay;
    },
    getLabels(startDay, days){
      let daysArray = [];
      for(let i = 0; i <= days; i++){
        const addDays = new Date(startDay).getDate() + i;
        const addedDays = new Date().setDate(addDays);
        const formatDate = new Date(addedDays).toISOString().slice(0, 10);
        daysArray.push(this.formatDate(formatDate));
      }
      return daysArray;
    },
    setInvColor(inventoriesIDArray, colorsArray, object){
      inventoriesIDArray.forEach((id, index) => {
        if(object[id]){
          if(colorsArray[index]){
            object[id].color = colorsArray[index];
          } else {
            let diff;
            do {
              diff = index - colorsArray.length
            } while (diff > colorsArray.length);
            object[id].color = colorsArray[diff];
          }
        } else if(!object[id]){
          const idData = {
            color: colorsArray[index],
            inventory: {}
          }
          object[id] = idData;
        }
      })
      this.isLoaded = true;
    },
    formatDate(date) {
      let arr = date.split('-');
      return arr.reverse().join('.');
    },
    async getStats(){
      this.inventoriesArray = [];
      this.inventoryColorObj = {};
      this.chartData.labels = [];
      this.chartData.datasets = [];
      const body = {
        "start_time": `${this.shortDateFrom}T10:00:00.000Z`,
        "end_time": `${this.shortDateTo}T23:00:00.000Z`,
        "group_by": this.groupBy,
      }
      const res = await fetch(stats.getStatsByResortID.URL+this.selectedResort.id, {
        method: stats.getStatsByResortID.METHOD,
        headers: headerWithToken,
        body: JSON.stringify(body)
      });

      if(res.ok) {
        const results = await res.json();
        this.chartData.labels = this.getLabels(this.shortDateFrom, this.getDatesDifference(this.shortDateFrom, this.shortDateTo));

        if(results.length === 0){
          this.chartData.datasets[0] = [];
          for(let i = 0; i < this.chartData.labels.length; i++){
            this.chartData.datasets[0].push(0);
          }
        } else {
          results.forEach((result) => {
            if(!this.inventoriesArray.includes(result.inventory_id)) {
              this.inventoriesArray.push(result.inventory_id);
            }
          });
          await this.getInventoryByID(results);
        }
      }
    },
    setCount(results){
      results.forEach(result => {
        const date = this.formatDate(result.date.slice(0, 10));
        const data = [];
        for(let i = 0; i < this.chartData.labels.length; i++){
          data.push(0);
        }
        const indexResultDate = this.chartData.labels.indexOf(date);

        if(indexResultDate !== -1){
          if(this.chartData.datasets.length === 0){
            data[indexResultDate] = result.count;

            this.datasetsIDObj[result.inventory_id] = 0;

            const about = {
              label: this.getEquipmentType(this.inventoryColorObj[result.inventory_id].inventory.type_id)
                  + ' ID ' + result.inventory_id,
              data: data,
              backgroundColor: this.backgroundColors[this.inventoryColorObj[result.inventory_id].inventory.type_id - 1]
            }
            this.chartData.datasets.push(about);
          } else {
            if(Object.keys(this.datasetsIDObj).includes(result.inventory_id.toString())) {
              this.chartData.datasets[this.datasetsIDObj[result.inventory_id]].data[indexResultDate] = result.count;
            } else {
              this.datasetsIDObj[result.inventory_id] = this.chartData.datasets.length;
              data[indexResultDate] = result.count;
              const about = {
                label: this.getEquipmentType(this.inventoryColorObj[result.inventory_id].inventory.type_id)
                    + ' ID ' + result.inventory_id,
                data: data,
                backgroundColor: this.backgroundColors[this.inventoryColorObj[result.inventory_id].inventory.type_id - 1]
              }
              this.chartData.datasets.push(about);
            }
          }
        }
      })
      return this.setInvColor(this.inventoriesArray, this.backgroundColors, this.inventoryColorObj);
    },
    getEquipmentType(type_id) {
      let name;
      this.GET_INVENTORY_TYPES.forEach(type => {
        if (type.id === type_id) {
          name = type.name;
        }
      })
      return name
    },
  },
  mounted() {
    this.getResorts();
    this.shortDateFrom = this.substratFromDate(new Date(), 'full', 7);
    this.shortDateTo = this.substratFromDate(new Date(), 'full', 0);
    if(!this.GET_INVENTORY_TYPES) this.fetchInventoryTypes();
  }
}
</script>

<style scoped>

.chart-container {
  margin: 0 auto;
  width: 90%;
  display: flex;
  flex-direction: column;
  gap: 2em;
}

.chart-filters {
  margin: 0 auto;
  width: 70%;
}

label {
  margin: 1em 0 0.5em;
}
</style>
