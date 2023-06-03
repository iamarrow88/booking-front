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
    <div class="chart-data" ref="results">
      <RenderChart v-if="isLoaded" :chartData="chartData" :chartOptions="chartOptions" :key="renderKey"/>
    </div>

    <modal-window v-if="isModalWindowShown">Идет загрузка</modal-window>
  </div>
</template>

<script>

import {headerWithToken, resorts, stats, inventory} from "@/data-and-functions/constants/URLS";
import RenderChart from "@/components/blocks/charts/RenderCharts.vue";
import {mapActions, mapGetters} from "vuex";
import ModalWindow from "@/components/blocks/modal/ModalWindow.vue";

export default {
  name: "ChartPage",
  components: {RenderChart, ModalWindow},
  data() {
    return {
      chartData: {
        labels: [ ],
        datasets: [ /*{ data: [40, 20, 12] }*/ ],
      },
      chartOptions: {
        responsive: true,
        scales: {
          y: {
            ticks: {
              min: 0,
              stepSize: 1,
              reverse: false,
              beginAtZero: true
            }
          }
        }
      },
      resorts: [],
      selectedResort: {},
      shortDateFrom: '2023-05-15',
      shortDateTo: '2023-06-03',

      splittedDateFrom: '',
      splittedDateTo: '',
      groupBy: 'DAY',
      inventoryColorObj: {},
      inventoriesArray: [],
      datasetsIDObj: {},
      isLoaded: false,
      isModalWindowShown: false,
      renderKey: 0,
      maxCount: 1,
      labelIndexes: {},
      lounchCounter: 0,
    }
  },
  computed: {
    ...mapGetters(['GET_INVENTORY_TYPES']),
  },
  watch: {
    groupBy(){
      if(this.lounchCounter > 0) this.getStats();
      this.renderKey += 1;
    },
    shortDateFrom(newDate){
      this.splittedDateFrom = newDate.split('-');
      if(this.lounchCounter > 0) this.getStats();
    },
    shortDateTo(newDate){
      this.splittedDateTo = newDate.split('-');
      if(this.lounchCounter > 0) this.getStats();
    },
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
    getLabels(start, count, sortBy){
      const monthsNames = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'];
      let labelsArray = [];
      if(sortBy === 'DAY') {
        for(let i = 0; i <= count; i++){
          const addDays = new Date(start).getDate() + i;
          const addedDays = new Date(start).setDate(addDays);
          const formattedDate = new Date(addedDays).toISOString().slice(0, 10);
          labelsArray.push(this.formatDate(formattedDate));
        }
      } else if(sortBy === 'MONTH') {
        let year = this.splittedDateFrom[0];
        let counter = +start;
        let basicMonth = +start;
        for(let i = 0; i < count; i++){
          if(counter === 13) {
            basicMonth = 1;
            counter = 1;
            year = +year + 1;
          }
          //const monthToAdd = basicMonth.toString().length === 1 ? '0' + basicMonth : basicMonth.toString();
          //labelsArray.push(monthToAdd);
          labelsArray.push(monthsNames[basicMonth - 1]);
          let key = `${year.toString()}-${basicMonth.toString().length === 1 ? '0' + basicMonth : basicMonth.toString()}`;
          this.labelIndexes[key] = i;
          counter += 1;
          basicMonth += 1;
        }

      } else if(sortBy === 'YEAR') {
        let basicYear = +start;
        for(let i = 0; i < count; i++){
          labelsArray.push(basicYear.toString());
          basicYear += 1;
        }
      }


      return labelsArray;
    },
    setInvColor(inventoriesIDArray, object){
      inventoriesIDArray.forEach((id) => {
        if(!object[id]){
          const idData = {
            inventory: {}
          }
          object[id] = idData;
        }
      })
      this.isLoaded = true;
      this.isModalWindowShown = false;
      setTimeout(() => {
        this.scrollToResults();
      }, 1)
    },
    formatDate(date) {
      let arr = date.split('-');
      return arr.reverse().join('.');
    },
    clearData(){
      this.chartData.datasets = [];
      this.chartData.labels = [];
      this.datasetsIDObj = {};
      this.inventoriesArray = [];
      this.inventoryColorObj = [];
      this.labelIndexes = {};
    },
    async getStats(){
      this.clearData();
      this.lounchCounter += 1;
      if(this.isLoaded) this.isLoaded = false;
      this.isModalWindowShown = true;
      const body = {
        "start_time": `${this.shortDateFrom}T10:00:00.000Z`,
        "end_time": `${this.shortDateTo}T23:00:00.000Z`,
        "group_by": this.groupBy,
      }

      console.log(body);
      const res = await fetch(stats.getStatsByResortID.URL+this.selectedResort.id, {
        method: stats.getStatsByResortID.METHOD,
        headers: headerWithToken,
        body: JSON.stringify(body)
      });

      if(res.ok) {
        const results = await res.json();
        if(this.groupBy === 'DAY'){
          this.chartData.labels = this.getLabels(this.shortDateFrom, this.getDatesDifference(this.shortDateFrom, this.shortDateTo), 'DAY');

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
        } else {
          if(this.groupBy === 'MONTH') {
            this.chartData.labels = this.getLabels(this.splittedDateFrom[1], this.howManyMonthsDiff(), 'MONTH');

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
          } else if(this.groupBy === 'YEAR'){
            this.chartData.labels = this.getLabels(this.splittedDateFrom[0], this.howManyYearsDiff(), 'YEAR');

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
        }
      }
    },
    setCount(results){
      results.forEach(result => {
        const data = [];
        for(let i = 0; i < this.chartData.labels.length; i++){
          data.push(0);
        }
        if(this.groupBy === 'DAY') {
          const date = this.formatDate(result.date.slice(0, 10));
          const indexResultDate = this.chartData.labels.indexOf(date);
          this.selDataToDataset(result, indexResultDate);
        } else if(this.groupBy === 'MONTH'){
          const month = result.date.split('-')[0] + '-' + result.date.split('-')[1];
          const indexOfMonth = Object.keys(this.labelIndexes).indexOf(month);
          this.selDataToDataset(result, indexOfMonth);
        } else if(this.groupBy === 'YEAR') {
          const year = result.date.split('-')[0];
          const yearIndex = this.chartData.labels.indexOf(year);
          this.selDataToDataset(result, yearIndex);
        }
      })
      return this.setInvColor(this.inventoriesArray, this.inventoryColorObj);
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
    getRandomColor() {
      const num = Math.random().toString(16).slice(3, 9);
      return `#${num}`;
    },
    selDataToDataset(result, index){
      const data = [];
      for(let i = 0; i < this.chartData.labels.length; i++){
        data.push(0);
      }

      if(this.chartData.datasets.length === 0){
        this.datasetsIDObj[result.inventory_id] = 0;
        data[index] = result.count;
        const about = {
          label: this.getEquipmentType(this.inventoryColorObj[result.inventory_id].inventory.type_id)
              + ' ID ' + result.inventory_id,
          data: data,
          backgroundColor: this.getRandomColor(),
        }
        this.chartData.datasets.push(about);
      } else {
        if(Object.keys(this.datasetsIDObj).includes(result.inventory_id.toString())) {
          this.chartData.datasets[this.datasetsIDObj[result.inventory_id]].data[index] = result.count;
        } else {
          this.datasetsIDObj[result.inventory_id] = this.chartData.datasets.length;
          data[index] = result.count;
          const about = {
            label: this.getEquipmentType(this.inventoryColorObj[result.inventory_id].inventory.type_id)
                + ' ID ' + result.inventory_id,
            data: data,
            backgroundColor: this.getRandomColor(),
          }
          this.chartData.datasets.push(about);
        }
      }
    },
    howManyDaysDiff(startDate, endDate){
      const MsPerDay = 86400000;
      return ((new Date(endDate) - new Date(startDate)) / MsPerDay) + 1;
    },
    howManyMonthsDiff(){
      const year1 = this.splittedDateFrom[0];
      const year2 = this.splittedDateTo[0];
      const month1 = this.splittedDateFrom[1];
      const month2 = this.splittedDateTo[1];

      if(year1 === year2) {
        if(month1 === month2){
          return 1;
        } else {
          return (+month2 - +month1) + 1;
        }
      } else {
        let monthsInYearsSum = 0;
        if((+year2 - +year1) >= 2){
            monthsInYearsSum = 12 * ((+year2 - +year1) - 1);
        }
        return monthsInYearsSum + (13 - +month1) + +month2;
      }
    },
    howManyYearsDiff(){
      const year1 = this.splittedDateFrom[0];
      const year2 = this.splittedDateTo[0];

      if(year1 === year2){
        return 1;
      } else {
        return (+year2 - +year1) + 1;
      }
    },
    scrollToResults() {
      const resultsBlock = this.$refs.results;
      resultsBlock.scrollIntoView({behavior: "smooth", block: "start"});
    },
  },
  mounted() {
    this.getResorts();
    this.shortDateFrom = this.substratFromDate(new Date(), 'full', 7);
    this.shortDateTo = this.substratFromDate(new Date(), 'full', 0);
    if(!this.GET_INVENTORY_TYPES) this.fetchInventoryTypes();
    this.splittedDateFrom = this.shortDateFrom.split('-');
    this.splittedDateTo = this.shortDateTo.split('-');
  }
}
</script>

<style>

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
