<template>
  <Bar
      id="my-chart-id"
      :chartOptions="chartOptions"
      :data="chartData"
  />
</template>

<script>
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
  name: 'RenderChart',
  components: { Bar },
  props: {
    chartData: {
      labels: Array,
      datasets: [ {
          label: String,
          backgroundColor: String,
          data: Array,
        }]
    },
    chartOptions: {
      responsive: Boolean
    },
  }
}
</script>
