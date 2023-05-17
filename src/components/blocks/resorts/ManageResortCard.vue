<template>
  <div class="add-resort">
    <button class="sub-btn create-resort-btn"
            @click="editComponent">Добавить курорт
    </button>
    <modal-window v-if="isCreateResortWindowOpen">
      <create-resort-block :editMode="false"
                           @updateResort="editResort"
      @closeAndRefreshAddWindow="editComponent">

      </create-resort-block>
    </modal-window>
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
import {mapActions, mapGetters} from "vuex";

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
      isCreateResortWindowOpen: false,
    }
  },
  computed: {
    ...mapGetters(['GET_CITIES']),
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
          this.isCreateResortWindowOpen = false;
        } else {
          this.errorMessage = "Invalid data provided, please try again";
        }

      } catch (error) {
        console.error(error)
      }
    },
    editComponent() {
      this.isCreateResortWindowOpen = !this.isCreateResortWindowOpen;
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
    },
    ...mapActions(['fetchCities']),
  },
  watch: {
    wasChangeResorts() {
      this.getUserResorts();
    }
  },
  async mounted() {
    await this.getUserResorts();
    if(this.GET_CITIES.length === 0) await this.fetchCities();
  },
}
</script>

<style scoped>
.resorts-list {
  display: flex;
  flex-wrap: wrap;
  gap: .2em;
  justify-content: flex-start;
  width: 90%;
  margin: 0 auto;
}

.create-resort-btn {
  margin: 1em;
}

.add-resort {
  width: 90%;
  margin: 0 auto;
  display: flex;
  justify-content: flex-start;
}
</style>
