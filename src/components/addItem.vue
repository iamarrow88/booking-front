<template>
  <h3>Здесь можно добавить инвентарь</h3>
  <div class="create-title">Добавить инвентарь</div>
  <label class="create-type" for="itemType">Выберите тип инвентаря</label>
  <select class="create-type-list" id="itemType" v-model="typeName">
    <option class="create-type-list-item" v-for="type in types" v-bind:key="type.id">{{ type.name }}</option>
  </select>

  <label class="create-resort" for="resortName">Выберите курорт</label>
  <select class="create-resort-list" id="resortName" v-model="resortName">
    <option class="create-resort-list-item" v-for="resort in resorts" v-bind:key="resort.id">{{ resort.name }}</option>
  </select>

  <label for="price" class="create-price">Введите стоимость</label>
  <input type="number" class="create-price-input" v-model="price">

  <label class="create-upload" for="upload-img">Загрузите фото</label>
  <input type="file" name="img" id="img" accept="image/*" @change="addImg">

  <button @click="createItem">Создать</button>
</template>

<script>
export default {
  name: "addItem",
  data() {
    return {
      types: [],
      resorts: [],
      typeName: '',
      resortName: '',
      price: null,
      formData: null,
    }
  },
  methods: {
    addImg(event) {
      console.log(event.target.files[0]);
      this.formData = new FormData();
      this.formData.append('img', event.target.files[0]);
    },
    async createItem() {
      this.formData.append('ItemType', this.typeName);
      this.formData.append('ResortName', this.resortName);
      this.formData.append('price', this.price);

      try {
        const response = await fetch('/api/inventories', {
          method: 'PUT',
          headers: {'Content-Type': 'application/json'},
          body: this.formData
        });
        const result = await response.json();
        console.log(JSON.stringify(result));
      } catch (error) {
        console.error(error);
      }
    }
  },
  async created() {
    this.editMode = this.$route.query.editMode;
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
      console.log(this.resortName)

    } catch (error) {
      console.error(error);
    }

  }

}
</script>

<style scoped>

select {
  max-width: 500px;
}

</style>