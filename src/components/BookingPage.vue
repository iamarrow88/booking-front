<template>
  <div>
    <h3>My Booking:</h3>
    <div>
      <ul>
        <li v-for="item in booking" :key="item.id">
          <p>Booking ID: {{ item.id }}</p>
          <p>Resort: {{ item.resort.name }}</p>
          <p>Inventory Type: {{ inv_types[item.inventory_id].name }}</p>
          <p>Start Date: {{ item.start_date }}</p>
          <p>End Date: {{ item.end_date }}</p>
          <p>Total Price: {{ item.total_price }}</p>
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
      const res = await fetch('/api/user/bookings', {
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

<style scoped>

</style>