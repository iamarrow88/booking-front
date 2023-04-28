<template>
  <h3>{{ IsEditEquipmModeOnFParent ? "Здесь можно изменить данные инвентаря" : "Здесь можно добавить инвентарь" }}</h3>
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

<!--  <label class="create-upload" for="upload-img">Загрузите фото</label>
  <input type="file" name="img" id="img" accept="image/*" class="create-upload-file">-->
  <form action="/upload" method="post" enctype="multipart/form-data" ref="uploadPhoto">
    <input type="file" name="photo">
    <input type="submit" value="Upload">
  </form>

  <button @click="createItem" class="cards-btn">{{ IsEditEquipmModeOnFParent ? "Сохранить изменения" : "Создать" }}</button>
</template>

<script>
export default {
  name: "addItem",
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
    }
  },
  methods: {
    async createItem() {
      const method = this.IsEditEquipmModeOnFParent ? 'PUT' : 'POST';
      const id = this.IsEditEquipmModeOnFParent ? this.itemFromParent.id : Date.now();
      /*if(!this.IsEditEquipmModeOnFParent) {
        this.photo = document.querySelector('.create-upload-file').files[0].webkitRelativePath;
      }*/
      const body = {
        id: id,
        type_id: +this.typeId,
        resort_id: +this.resortId,
        price: +this.price,
      }
      /*if(this.photo) body.photo = this.photo;*/

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
        if(response.ok) {
          await this.uploadPhoto(id);
          this.$emit('isAddItemBlockOpen', false)
          console.log('OK');
        }
        else {
          console.log('ошибка')
        }
      } catch (error) {
        console.error(error);
      }
    },
    async uploadPhoto(itemId){
      const photoBlock = this.$refs.uploadPhoto;
      const uploadPhotoForm = new FormData(photoBlock);
      console.log(itemId);
      for(let [name, value] in uploadPhotoForm){
        console.log(`name - ${name}, value - ${value}`);
      }

      try {
        const response = await fetch(`/api/inventories/update_img/${itemId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          body: uploadPhotoForm
        });
        if(response.ok) {
          console.log('OK upload photo');
        }
        else {
          console.log('ошибка upload photo')
        }
      } catch (error) {
        console.error(error);
      }
    },
    getResortName() {
      this.resorts.forEach(resort => {
        if(resort.id === this.resortIdFromParent) this.resortName = resort.name;
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
      if(this.isEditEquipmModeOnFComp) {
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
    this.resortId = this.resortIdFromParent ? this.resortIdFromParent : this.resorts[0];
    this.getResortName();
    this.price = this.itemFromParent.price ? this.itemFromParent.price : '';
    this.photo = this.itemFromParent.photo ? this.itemFromParent.photo : '';

  },
  watch: {
    typeName(newName) {
      this.types.forEach(type => {
        if(type.name === newName) this.typeId = type.id;
      })
    },
    resortName(newResort){
      for(let i = 0; i < this.resorts.length; i++) {
        if(this.resorts[i].name === newResort) this.resortId = this.resorts[i].id
      }
    },
  }

}
</script>

<style scoped>

select {
  max-width: 500px;
}

</style>