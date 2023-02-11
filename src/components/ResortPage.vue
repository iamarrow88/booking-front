<template>
  <div>
    <h3>Items for {{ resortName }}:</h3>
    <ul>
      <li v-for="item in items" :key="item.id">
        {{ this.$route.query.type}} - {{ item.price }}
        <img :src="item.photo" alt="Item Photo">
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      resortName: '',
      items: []
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
  }
}
</script>
