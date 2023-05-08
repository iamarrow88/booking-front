<template>

  <div class="add-resort">
    <button class="sub-btn"
            @click="editComponent">Добавить курорт
    </button>
    <create-resort-block v-if="isEditComponent"
                         :editMode="false"
                         @updateResort="editResort"></create-resort-block>
  </div>
  <div class="resorts-list" v-if="resorts.length > 0">
    <resort-item @editResortFromItem="editResort"
                 @deleteResort="deleteResort" v-for="resort in resorts"
                 :key="resort.id"
                 :resort="resort"></resort-item>
  </div>
  <div v-if="errorMessage" class="error-message">
    {{ errorMessage }}
  </div>
</template>

<script>
import ResortItem from "@/components/items/resorts/ResortItem.vue";
import CreateResortBlock from "@/components/blocks/resorts/CreateResortBlock.vue";

export default {
  name: "ManageResortCard",
  components: ResortItem, CreateResortBlock,
  data() {
    return {
      resorts: [],
      userId: null,
      errorMessage: null,
      city: '',
      isEditComponent: false,
      cities: [],
      wasChangeResorts: 0,
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
          this.wasChangeResorts += 1;
        }
      } catch (e) {
        console.error(e);
      }
    },
    async editResort(editMode, cityId, resortId, resortName, resortAddress, resortDescription, userId) {
      console.log('edit', resortId);
      console.log(arguments);

      const method = editMode ? 'PUT' : 'POST';
      const body = {
        name: resortName,
        city_id: +cityId,
        owner_id: +userId,
        description: resortDescription,
        address: resortAddress
      }
      if (editMode) body['id'] = +resortId;
      console.log(body);

      try {
        const response = await fetch('/api/resorts', {
          method: method,
          headers: {
            'Content-Type': 'application/json',
            'Accept': '*',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(body)
        });

        if (response.ok) {
          console.log('ok');
          this.wasChangeResorts += 1;
          this.isEditComponent = false;
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
    },
    async getUserResorts() {
      try {
        const resorts = await fetch('/api/myresorts',
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
              },
            });
        this.resorts = await resorts.json();
      } catch (e) {
        console.error(e);
      }
    }
  },
  watch: {
    wasChangeResorts() {
      this.getUserResorts();
    }
  },
  async mounted() {
    if (localStorage.getItem('firstName').length === 0) {
      console.log(localStorage.getItem('firstName').length);
    }
    await this.getUserResorts();
    try {
      const cities = await fetch('/api/cities');
      this.cities = await cities.json();
      if (!this.editMode) {
        this.cityName = this.cities[0].name;
        this.cityId = this.cities[0].id
      }
    } catch (error) {
      console.error(error)
    }
  },
  /*computed: {
    getUsersResorts() {
      return [...this.allResorts].filter(resort => resort.owner_id === +this.userId);
    }
  }*/
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