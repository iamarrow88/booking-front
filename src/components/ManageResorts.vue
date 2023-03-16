<template>
<!--  <div class="resorts-list"
  v-if="usersResorts.length > 0">
    <div v-for="resort in usersResorts" :key="resort.id">{{ resort.name }}</div>
  </div>-->
  <div class="add-resort">
    <router-link to="/addResort" :editingMode="false">Добавить курорт</router-link>
  </div>
  <router-link to="/resorts/equipment">Страница управления снаряжением</router-link>
  <div class="resorts-list" v-if="usersResorts.length > 0">
      <resort-item @editResort="this.$router.push({path: '/addResort', query: { resortId: resort.id, editMode: true }})"
                   @deleteResort="deleteResort" v-for="resort in usersResorts"
                   :key="resort.id" :resort="resort"></resort-item>
  </div>
  <div v-if="errorMessage" class="error-message">
    {{ errorMessage }}
  </div>
</template>

<script>
import ResortItem from "@/components/ResortItem.vue";
/*
import CreateResortPage from "@/components/CreateResortPage.vue";
*/

export default {
  name: "ManageResorts",
  components: {/*CreateResortPage,*/ ResortItem},
  data() {
    return {
      allResorts: [],
      usersResorts: [],
      userId: 3,
      errorMessage: null,
    }
  },
  methods: {
    async deleteResort(resortId) {
      console.log('delete', resortId);
      try {
        const response = await fetch(`/api/resorts/${resortId}`, {
          method: 'DELETE',
        });
        if(response.ok) {
          try {
            const resorts = await fetch('/api/resorts');
            this.allResorts = await resorts.json();
            console.log(this.allResorts);
            this.usersResorts = this.allResorts.filter(resort => resort.owner_id === +this.userId)
          } catch (e) {
            console.error(e);
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
    },
    async editResort(resortId) {
    this.isEditOpen = !this.isEditOpen;
      console.log('edit', resortId);
      try {
        const res = await fetch(`/resorts/${resortId}`, {
          method: 'PUT',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({

          })
        });
        if(res.ok) {
          try {
            const resorts = await fetch('/api/resorts');
            this.allResorts = await resorts.json();
            console.log(this.allResorts);
            this.usersResorts = this.allResorts.filter(resort => resort.owner_id === +this.userId);

          } catch (e) {
            console.error(e);
          }
        } else {
          this.errorMessage = "Invalid data provided, please try again";
        }
      } catch (e) {
        console.error(e);
      }

  },
  async mounted() {
    try {
      const resorts = await fetch('/api/resorts');
      this.allResorts = await resorts.json();
      console.log(this.allResorts);
      this.usersResorts = this.allResorts.filter(resort => resort.owner_id === +this.userId);
    } catch (e) {
      console.error(e);
    }
    //this.userId = +localStorage.getItem('userId');
  },
  watch: {
    usersResorts() {
      return this.allResorts.filter(resort => resort.owner_id === +this.userId);
    }
  }
}
</script>

<style scoped>

</style>