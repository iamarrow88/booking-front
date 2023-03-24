<template>
  <div class="my-booking-item">
    <div class="my-booking-item-header">
      <p class="my-booking-id"><b>ID бронирования:</b> {{ item.id }}</p>
      <p class="my-booking-resort"><b>Курорт:</b> {{ item.resort.name }}</p>
    </div>
    <div class="my-booking-item-body">
      <p><b>Тип инвентаря:</b> {{ getInvTypeName }}</p>
      <p><b>Начало:</b> {{ startTimeFormatted }}</p>
      <p><b>Конец:</b> {{ endTimeFormatted }}</p>
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
.my-booking-item {
  margin-bottom: 1rem;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
}

.my-booking-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.my-booking-id {
  margin: 0;
  font-size: 1.25rem;
  font-weight: bold;
}

.my-booking-resort {
  margin: 0;
  font-size: 1.25rem;
  color: #666;
}

.my-booking-item-body {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}

.my-booking-item-body p {
  margin: 0;
  font-size: 1.1rem;
}

@media (max-width: 767px) {
  .my-booking-id {
    font-size: 1rem;
  }

  .my-booking-resort {
    font-size: 1rem;
  }

  .my-booking-item-body p {
    font-size: 0.9rem;
  }
}
</style>