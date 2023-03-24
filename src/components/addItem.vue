<template>
  <h3>{{ editEquipmModeFromParent ? "Здесь можно изменить данные инвентаря" : "Здесь можно добавить инвентарь" }}</h3>
  <div class="create-title">{{ editEquipmModeFromParent ? "Изменить данные инвентаря" : "Добавить инвентарь" }}</div>
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

  <label class="create-upload" for="upload-img">Загрузите фото</label>
  <input type="file" name="img" id="img" accept="image/*" @change="addImg">

  <button @click="createItem">{{ editEquipmModeFromParent ? "Сохранить изменения" : "Создать" }}</button>
</template>

<script>
export default {
  name: "addItem",
  props: {
    editEquipmModeFromParent: Boolean
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
      editMode: null,

    }
  },
  methods: {
    addImg(event) {
      this.photo = event.target.files[0];
    },
    async createItem() {
      const id = Date.now();

      try {
        const response = await fetch('/api/inventories', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            id: id,
            type_id: +this.typeId,
            resort_id: +this.resortId,
            price: +this.price,
            photo: this.photo
          })
        });
        const result = await response.json();
        console.log(result);
        if(result.ok){
          console.log('here')
          this.editMode = false;
          this.$emit('isAddItemBlockOpen', false)
        } else {
          console.log('ошибка')
        }
      } catch (error) {
        console.error(error);
      }
    }
  },
  async created() {
    this.editMode = this.$route.query.editMode ? this.$route.query.editMode : this.editModeFromParent;
    try {
      const types = await fetch('/api/inventories/types');
      this.types = await types.json();
      this.typeName = this.types[0].name;
    } catch (error) {
      console.error(error);
    }
    try {
      const resorts = await fetch('/api/resorts');
      this.resorts = await resorts.json();
    } catch (error) {
      console.error(error);
    }

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
    }
  }

}
</script>

<style scoped>

select {
  max-width: 500px;
}

</style>