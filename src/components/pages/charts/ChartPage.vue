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
      <RenderChart :chartData="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script>

import {headerWithToken, resorts, stats} from "@/data-and-functions/constants/URLS";
import RenderChart from "@/components/blocks/charts/RenderCharts.vue";

export default {
  name: "ChartPage",
  components: {RenderChart},
  data() {
    return {
      chartData: {
        labels: [ 'January', 'February', 'March' ],
        datasets: [ { data: [40, 20, 12] } ]
      },
      chartOptions: {
        responsive: true
      },
      resorts: [],
      selectedResort: {},
      shortDateFrom: '',
      shortDateTo: '',
      groupBy: 'DAY',
      stats: [],
      resortIDArray: [],
    }
  },
  methods: {
    async getStats(){
      const body = {
        "start_time": `${this.shortDateFrom}T10:00:00.000Z`,
        "end_time": `${this.shortDateTo}T23:00:00.000Z`,
        "group_by": this.groupBy,
      }
      console.log(body);

      for(let i = 0; i < this.resortIDArray.length; i++){
        const res = await fetch(stats.getStatsByResortID.URL+this.resortIDArray[i], {
          method: stats.getStatsByResortID.METHOD,
          headers: headerWithToken,
          body: JSON.stringify(body)
        });

        if(res.ok) {
          const stats = {
            id: this.resortIDArray[i],
            statistics: await res.json(),
          }
          this.stats[i] = stats;
        }
      }

    },
    async getResorts(){
      const resortsArray= await fetch(resorts.allResorts.URL);
      this.resorts = await resortsArray.json();
      this.selectedResort = this.resorts[0];
      this.getResortIdArray();
    },
    getShortDate(fullDate) {
      return (fullDate.toISOString().slice(0, 10));
    },
    substratFromDate(dateFull, dateType, daysToSubstrat) {
      let date = dateType === 'short' ? new Date(dateFull) : dateFull;
      return new Date(date.setDate(new Date().getDate() - daysToSubstrat)).toISOString().slice(0, 10);
    },
    getResortIdArray(){
      this.resortIDArray = this.resorts.map(resort => {
        console.log(resort.id);
        return resort.id;
      });
    }
  },
  mounted() {
    this.getResorts();
    this.shortDateFrom = this.substratFromDate(new Date(), 'full', 1);
    this.shortDateTo = this.shortDateFrom;
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
