<template>
  <div class="my-booking">
    <h3 class="my-booking-title">All Booking:</h3>
    <div>
      <ul>
        <li v-for="item in booking" :key="item.id" class="my-booking-item">
          <div class="my-booking-item-header">
            <p class="my-booking-id">Booking ID: {{ item.id }}</p>
            <p class="my-booking-resort">Resort: {{ item.resort.name }}</p>
          </div>
          <div class="my-booking-item-body">
            <p>Inventory Type: {{ inv_types[item.inventory_id].name }}</p>
            <p>Start Date: {{ item.start_date }}</p>
            <p>End Date: {{ item.end_date }}</p>
            <p>Total Price: {{ item.total_price }}</p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      booking: [],
      inv_types: [],
    }
  },
  async mounted() {
    try {
      const res = await fetch('/api/resorts/bookings', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
      });

      if (!res.ok) {
        this.errorMessage = "Invalid data provided, please try again";
      } else {
        this.booking = await res.json()
        console.log(this.booking)
      }
    } catch (err) {
      console.error(err);
    }
    try {
      const res = await fetch('/api/inventories/types', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
      });

      if (!res.ok) {
        this.errorMessage = "Invalid data provided, please try again";
      } else {
        this.inv_types = await res.json()
        console.log(this.inv_types)
      }
    } catch (err) {
      console.error(err);
    }


  }
}
</script>
<style>
.my-booking {
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
}

.my-booking-title {
  margin-top: 0;
  font-size: 1.5rem;
  font-weight: bold;
}

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
  margin-top: 1rem;
}

.my-booking-item-body p {
  margin: 0;
  font-size: 1.1rem;
}

@media (max-width: 767px) {
  .my-booking-title {
    font-size: 1.25rem;
  }

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