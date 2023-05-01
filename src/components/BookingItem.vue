<template>
  <div class="my-booking-item">
    <div class="my-booking-item__header">
      <div class="my-booking-item__id"><b>ID бронирования:</b> {{ item.id }}</div>
      <div class="my-booking-item__resort"><b>Курорт:</b> {{ item.resort.name }}</div>
    </div>
    <div class="my-booking-item__body">
      <p><b>Тип инвентаря:</b> {{ getInvTypeName }}</p>
      <div class="body__term">
        <p><span>Начало:</span> {{ startTimeFormatted }}</p>
        <p><b>Конец:</b> {{ endTimeFormatted }}</p>
      </div>
      <p><b>Полная стоимость:</b> {{ item.total_price }} RUB</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "BookingItem",
  props: {
    item: {
      id: Number,
      user_id: Number,
      inventory_id: Number,
      inventory: Object,
      resort: Object,
      total_price: Number,
      start_time: String,
      end_time: String
    },
    inventoryTypes: Array,
  },
  data() {
    return {
      startTimeFormatted: '',
      endTimeFormatted: ''
    }
  },
  methods: {
    formatTime(originTime) {
      let arrDate = originTime.split('-');
      let arrTime = arrDate[2].split(':');
      let day = arrDate[2].slice(0, 2);
      arrDate = arrDate.reverse();
      arrDate[0] = day;
      let date = arrDate.join('.')
      let hour = arrTime[0].slice(3, 5);
      let time = hour + ':00';
      return [date, time];
    }
  },
  computed: {
    getInvTypeName() {
      let typeName = '';
      this.inventoryTypes.forEach(type => {
        if(type.id === this.item.inventory.type_id) typeName = type.name;
      })
      return typeName;
    },
  },
  created() {
    this.startTimeFormatted = this.formatTime(this.item.start_time).join(' ');
    this.endTimeFormatted = this.formatTime(this.item.end_time).join(' ');
  }
}
</script>

<style scoped>

</style>