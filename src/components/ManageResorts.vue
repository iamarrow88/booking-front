<template>

  <div class="add-resort">
    <button class="sub-btn"
            @click="editComponent">Добавить курорт</button>
    <create-resort-page v-if="isEditComponent"
                        :editMode="false"
                        @updateResort="editResort"></create-resort-page>
  </div>
  <router-link to="/resorts/equipment">Страница управления снаряжением</router-link>
  <div class="resorts-list" v-if="usersResorts.length > 0">
    <resort-item @editResortFromItem="editResort"
                 @deleteResort="deleteResort" v-for="resort in getUsersResorts"
                 :key="resort.id"
                 :resort="resort"></resort-item>
  </div>
  <div v-if="errorMessage" class="error-message">
    {{ errorMessage }}
  </div>
</template>

<script>
import ResortItem from "@/components/ResortItem.vue";
import CreateResortPage from "@/components/CreateResortPage.vue";

export default {
  name: "ManageResorts",
  components: {CreateResortPage, ResortItem},
  data() {
    return {
      allResorts: [],
      usersResorts: [],
      userId: null,
      errorMessage: null,
      city: '',
      isEditComponent: false
    }
  },
  methods: {
    async deleteResort(resortId) {
      console.log('delete', resortId);
      try {
        const response = await fetch(`/api/resorts/${resortId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
        });
        if (response.ok) {
          try {
            const resorts = await fetch('/api/myresorts',
                {
                  method: 'GET',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                  },
                });
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
    },
    async editResort(editMode, cityId, resortId, resortName, resortAddress, resortDescription, userId) {
      console.log('edit', resortId);
      const method = editMode ? 'PUT' : 'POST';

      try {
        const response = await fetch('/api/resorts', {
          method: method,
          headers: {
            'Content-Type': 'application/json',
            'Accept': '*',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
                id:  +resortId,
                name: resortName,
                city_id: +cityId,
                owner_id: +userId,
                description: resortDescription,
                address: resortAddress
            }
          )
        });
        const result = await response.json();
        if(result.ok){
          console.log('ok');
          this.resortName = '';
          this.resortAddress = '';
          this.resortDescription = '';
          this.city = this.cities[0].name;
        } else {
          this.errorMessage = "Invalid data provided, please try again";
        }

      } catch (error) {
        console.error(error)
      }
    },
    editComponent() {
      this.isEditComponent = !this.isEditComponent;
    }
  },

  async mounted() {
    try {
      const resorts = await fetch('/api/myresorts',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`
            },
          });
      this.allResorts = await resorts.json();
      this.userId = localStorage.getItem('userId');
      this.usersResorts = this.allResorts.filter(resort => resort.owner_id === +this.userId);

    } catch (e) {
      console.error(e);
    }
  },
  computed: {
    getUsersResorts() {
      return [...this.allResorts].filter(resort => resort.owner_id === +this.userId);
    }
  }
}
</script>

<style scoped>
.sub-btn {
  padding: 7px;
  background-color: transparent;
  cursor: pointer;
  color: darkslateblue;
  text-decoration: underline;

}

</style>