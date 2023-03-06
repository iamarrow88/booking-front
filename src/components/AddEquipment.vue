<template>
  <div class="create-equipment">
    <div class="create-equipment-header">Добавить инвентарь</div>
    <div class="create-equipment-form">
      <div class="create-equipment-block">
        <label for="type" class="create-equipment-label">Выберите тип снаряжения</label>
        <select name="type" id="type" v-model="type" class="create-equipment-input">
          <option v-for="type in types"
                  :value="type"
                  :key="type.id"
                  class="create-equipment-option">{{ type.name }}</option>
        </select>
      </div>
      <div class="create-equipment-block">
        <label for="resort" class="create-equipment-label">Выберите название курорта</label>
        <select name="resort" id="resort" v-model="resort" class="create-equipment-input">
          <option v-for="resort in resorts"
                  :value="resort"
                  :key="resort.id"
                  class="create-equipment-option">{{ resort.name }}</option>
        </select>
      </div>
      <div class="create-equipment-block">
        <label for="price" class="create-equipment-label">Введите стоимость</label>
        <input type="text" v-model="price" class="create-equipment-input">
      </div>
      <div class="image create-equipment-block">
        <label for="img" class="create-equipment-label">Выберите фото</label>
        <input type="file"
               id="img"
               name="img"
               accept="image/*"
               @change="uploadFile">
        <div v-for="{file, index} in files" :key="index">
          <img :src="getUrl(file)" alt='file `${index}`' >
        </div>
        <button type="submit">Загрузить фото</button>
      </div>
    </div>
    <button type="submit">Создать карточку снаряжения</button>
  </div>
</template>

<script>
export default {
  name: "AddEquipment",
  data(){
    return {
      price: null,
      type: null,
      types: [],
      resort: null,
      resorts: [],
      files: [],
    }
  },
  methods: {
    uploadFile(event) {
      this.files = Array.from(event.target.files);
    },
    getUrl(file) {
      return URL.createObjectURL(file);
    }
  },
  async created() {
    try {
      const types = await fetch('/api/inventories/types');
      this.types = await types.json();
      const resorts = await fetch('/api/resorts');
      this.resorts = await resorts.json();
    } catch (error){
      console.error(error)
    }
  }
}

</script>

<style scoped>
  .create-equipment {
    width: 100%;
  }
  .create-equipment-header {
    font-size: 26px;
    margin-bottom: 40px;
  }

  .create-equipment-form {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 30px;
    margin-bottom: 50px;
  }

  .create-equipment-block {
    width: 80%;
    margin: 0 auto;
  }

  .create-equipment-label {
    font-size: 20px;
  }

  .create-equipment-input {
    width: 80%;
  }

  .create-equipment-option {
    width: 500px;
  }
</style>