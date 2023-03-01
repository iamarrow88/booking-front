<template>
  <div class="items-for-resort">
    <h3 class="items-for-resort-title">Items for {{ resortName }}:</h3>
    <ul class="items-for-resort-list">
      <li v-for="item in items" :key="item.id" class="items-for-resort-item">
        <div class="items-for-resort-item-header">
          <p class="items-for-resort-item-type">{{ this.$route.query.type }}</p>
          <p class="items-for-resort-item-price">{{ item.price }}</p>
        </div>
        <img class="items-for-resort-item-photo" :src="item.photo" alt="Item Photo">
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      resortName: '',
      items: [],
      types: []
    }
  },
  async mounted() {
    try {
      const response = await fetch(`http://localhost:8081/api/resorts/${this.$route.params.id}`)
      const resort = await response.json()
      this.resortName = resort.name
    } catch (error) {
      console.error(error)
    }
    try {
      const response = await fetch(`http://localhost:8081/api/resorts/inventories/${this.$route.params.id}`)
      this.items = await response.json()
    } catch (error) {
      console.error(error)
    }
    try {
      const types = await fetch('/api/inventories/types')
      this.types = await types.json()
    } catch (error) {
      console.error(error)
    }
  }
}
</script>

<style>
.items-for-resort {
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
}

.items-for-resort-title {
  margin-top: 0;
  font-size: 1.5rem;
  font-weight: bold;
}

.items-for-resort-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.items-for-resort-item {
  margin-bottom: 1rem;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.items-for-resort-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-grow: 1;
  margin-right: 1rem;
}

.items-for-resort-item-type {
  margin: 0;
  font-size: 1.25rem;
  font-weight: bold;
}

.items-for-resort-item-price {
  margin: 0;
  font-size: 1.25rem;
  color: #666;
}

.items-for-resort-item-photo {
  height: 100%;
  max-height: 10rem;
  object-fit: cover;
  border-radius: 0.5rem;
}

@media (max-width: 767px) {
  .items-for-resort-title {
    font-size: 1.25rem;
  }

  .items-for-resort-item-type {
    font-size: 1rem;
  }

  .items-for-resort-item-price {
    font-size: 1rem;
  }
}
</style>
