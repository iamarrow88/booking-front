<template>
  <li class="result-item">
    <p class="item__header">{{ resort.name }}</p>
    <p class="my-2"><b>Адрес:</b> {{ resort.address }}</p>

    <button @click="isMoreShown=!isMoreShown"
            class="cards-btn">Подробнее</button>
    <p class="my-2" v-if="isMoreShown"><b>Описание:</b> {{ resort.description }}</p>

    <button
        @click="$router.push({ path: '/resorts/' + resort.id, query:
                 {
                  type_id: selectedType.id,
                  selectedCityId: selectedCity.id,
                  selDateStartShort: selDateStartShort,
                  selDateEndShort:selDateEndShort,
                  startTime: startTime,
                  endTime: endTime,
                  duration: duration
                 }
                })"
    class="cards-btn">
      Посмотреть инвентарь
    </button>

  </li>
</template>

<script>
export default {
  name: "ResultItemFromStartPage",
  props: {
    resort: {
      id: Number,
      name: String,
      city_id: Number,
      owner_id: Number,
      description: String,
      address: String
    },
    selectedType: {
      id: Number,
      name: String
    },
    selectedCity: {
      id: Number,
      name: String
    },
    selDateStartShort: String,
    selDateEndShort: String,
    startTime: String,
    endTime: String,
    duration: Number
  },
  data() {
    return {
      isMoreShown: false,
    }
  }
}
</script>

<style scoped>

.result-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 250px;
  margin: 30px 10px 0;
  padding: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  overflow: hidden;
}


.my-2 {
  margin-top: 1rem;
  margin-bottom: 1rem;
}
/*
.list-group-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 20vw;
  margin: 30px auto 0;
  padding: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  overflow: hidden;
}*/
.item__header {
  font-size: 18px;
  font-weight: 800;
}




</style>