<template>
  <div>
    <h3>Items for {{ resortName }}:</h3>
    <ul>
      <li v-for="item in items" :key="item.id">{{ item.name }}</li>
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
      this.items = resort.items
    } catch (error) {
      console.error(error)
    }
  }
}
</script>
