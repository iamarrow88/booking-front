<template>
  <div v-for="resort in allResorts" :key="resort.id">{{ resort.name }}</div>
</template>

<script>
export default {
  name: "ManageResorts",
  data() {
    return {
      allResorts: [],
    }
  },
  async mounted() {
    try {
      const resorts = await fetch('/api/resorts');
      this.allResorts = await resorts.json();
    } catch (e) {
      console.error(e);
    }
  }
}
</script>

<style scoped>

</style>