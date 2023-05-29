<template>
  <div class="inventory-card">
    <h3 class="inventory-card__title">{{ IsEditEquipmModeOnFParent ? "Здесь можно изменить данные инвентаря" : "Здесь можно добавить инвентарь" }}</h3>
    <div class="create-title">{{ IsEditEquipmModeOnFParent ? "Изменить данные инвентаря" : "Добавить инвентарь" }}</div>
    <label class="create-type" for="itemType">Выберите тип инвентаря</label>
    <select class="create-type-list" id="itemType" v-model="typeName">
      <option class="create-type-list-item" v-for="type in types" v-bind:key="type.id">{{ type.name }}</option>
    </select>

    <label class="create-resort" for="resortName">Выберите курорт</label>
    <select class="create-resort-list" id="resortName" v-model="resortName">
      <option class="create-resort-list-item" v-for="resort in resorts" v-bind:key="resort.id">{{ resort.name }}</option>
    </select>

    <label for="price" class="create-price">Введите стоимость</label>
    <input type="number" class="create-price-input" v-model="price" min="1">

    <label for="uploadPhoto" class="upload-photo-label">Загрузить фото</label>
    <input type="file" id="uploadPhoto" ref="uploadPhoto" @change="onFileSelected"/>

    <div class="buttons">
      <button @click="createItem" class="cards-btn action">{{
          IsEditEquipmModeOnFParent ? "Сохранить изменения" : "Создать"
        }}
      </button>
      <button class="cards-btn" @click="cancel">Отмена</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "InventoryCard",
  props: {
    IsEditEquipmModeOnFParent: Boolean,
    resortIdFromParent: Number,
    itemFromParent: {
      id: Number,
      photo: String,
      price: Number,
      resort_id: Number,
      type_id: Number
    }
  },
  data() {
    return {
      types: [],
      resorts: [],

      typeName: '',
      typeId: '',
      resortName: '',
      resortId: null,
      price: null,
      photo: null,

      isEditEquipmModeOnFComp: null,
      counter: 0,

      selectedFile: null,

    }
  },
  methods: {
    async createItem() {
      const method = this.IsEditEquipmModeOnFParent ? 'PUT' : 'POST';
      const id = this.IsEditEquipmModeOnFParent ? this.itemFromParent.id : Date.now();

      const body = {
        id: id,
        type_id: +this.typeId,
        resort_id: +this.resortId,
        price: +this.price,
      }
      console.log(body);

      try {
        const response = await fetch('/api/inventories', {
          method: method,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(body)
        });
        if (response.ok) {
          await this.uploadPhoto(id);
          this.$emit('refreshInventoryArray');
          this.$emit('isAddItemBlockOpen');
          console.log('OK');
        } else {
          console.log('ошибка')
        }
      } catch (error) {
        console.error(error);
      }
    },
    cancel(e){
      this.$emit('closeAndRefreshAddWindow', e)
    },
    async uploadPhoto(itemId) {
      if (!this.selectedFile) {
        console.log('No file selected');
        /*this.$emit('refreshInventoryArray');*/
        return;
      }

      const uploadPhotoForm = new FormData();
      uploadPhotoForm.append('id', itemId);
      uploadPhotoForm.append('image', this.selectedFile);

      try {
        const response = await fetch(`/api/inventories/update_img/${itemId}`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          body: uploadPhotoForm
        });

        if (response.ok) {
          console.log('OK upload photo');
        } else {
          console.log('ошибка upload photo');
        }
      } catch (error) {
        console.error(error);
      }
    },

    onFileSelected(event) {
      if (event.target.files.length > 0) {
        this.selectedFile = event.target.files[0];
      }
    },

    getResortName() {
      this.resorts.forEach(resort => {
        if (resort.id === this.resortIdFromParent) this.resortName = resort.name;
      })
    },
    getTypeName() {
      this.types.forEach(type => {
        if (type.id === this.typeId) this.typeName = type.name;
      })
    }
  },
  async created() {
    this.isEditEquipmModeOnFComp = this.$route.query.editMode ? this.$route.query.editMode : this.IsEditEquipmModeOnFParent;
    try {
      const types = await fetch('/api/inventories/types');
      this.types = await types.json();
      if (this.isEditEquipmModeOnFComp) {
        this.typeId = this.itemFromParent.type_id ? this.itemFromParent.type_id : this.types[0];
        this.getTypeName();
      } else {
        this.typeName = this.types[0].name;
      }
    } catch (error) {
      console.error(error);
    }
    try {
      const resorts = await fetch('/api/resorts');
      this.resorts = await resorts.json();
    } catch (error) {
      console.error(error);
    }
    this.resortId = this.resortIdFromParent ? this.resortIdFromParent : this.resorts[0].id;
    this.getResortName();
    this.price = this.itemFromParent ? this.itemFromParent.price : '';
    this.photo = this.itemFromParent ? this.itemFromParent.photo : '';

  },
  watch: {
    typeName(newName) {
      this.types.forEach(type => {
        if (type.name === newName) this.typeId = type.id;
      })
    },
    resortName(newResort) {
      for (let i = 0; i < this.resorts.length; i++) {
        if (this.resorts[i].name === newResort) this.resortId = this.resorts[i].id
      }
    },
  }

}
</script>

<style scoped>

select {
  max-width: 500px;
}

.inventory-card {
  padding: 3em;
}

</style>
