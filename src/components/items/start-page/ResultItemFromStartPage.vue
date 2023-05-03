<template>
  <li class="result-item">
    <div class="item">
      <div class="item__header">{{ resort.name }}</div>
      <div class="item__address">
        <img class="address__img" src="../../../assets/icons/map-pin.svg" alt="pin">
        <p class="address__text">
          {{ resort.address }}
        </p>
      </div>
      <div class="item__rate">
        <stars-rate :rate="resort.rate"></stars-rate>
      </div>

      <button @click="showMore"
              class="cards-btn">Подробнее</button>
      <p class="item__description" v-if="isMoreShown"><b>Описание:</b> {{ resort.description }}</p>

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

    </div>
    <div class="reviews">
      <div class="reviews__title">Отзывы</div>
      <review-block v-for="review in reviews"
                    :review="review"
                    :users="users"
                    :key="review.id"
                   :class="{active: review.index === this.currentReview}"
      @prev="prev"
      @next="next"></review-block>
    </div>
  </li>
</template>

<script>
import starsRate from "@/components/UI/StarsRate.vue";
import ReviewBlock from "@/components/blocks/start-page/ReviewBlock.vue";

export default {
  name: "ResultItemFromStartPage",
  components: starsRate, ReviewBlock,
  props: {
    resort: {
      id: Number,
      name: String,
      city_id: Number,
      owner_id: Number,
      description: String,
      address: String,
      rate: Number
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
    duration: Number,
    rate: Number
  },
  data() {
    return {
      isMoreShown: false,
      users: [],
      reviews: [],
      currentReview: 0,
    }
  },
  methods: {
    showMore(e){
      const parent = e.target.parentNode;
      parent.parentElement.classList.toggle('showMore');
      this.isMoreShown = !this.isMoreShown;
    },
    async getUsers(){
      try {
        const res = await fetch('https://jsonplaceholder.typicode.com/users');
        if(res.ok) {
          this.users = await res.json();
        } else {
          console.log('there is no users')
        }
      } catch (e) {
        console.error(e);
      }
    },
    async getReviews(){
      try {
        const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5');
        if(res.ok) {
          this.reviews = await res.json();
        } else {
          console.log('there is no reviews')
        }
        this.reviews.forEach((review, index) => {
          return review.index = index;
        })
      } catch (e) {
        console.error(e)
      }
    },
    prev() {
      this.currentReview -= 1;
      if(this.currentReview < 0) this.currentReview = (this.reviews.length - 1);

    },
    next() {
      this.currentReview += 1;
      if(this.currentReview >= this.reviews.length) this.currentReview = 0;

    }
  },
  mounted() {
    this.getUsers();
    this.getReviews();
  }
}
</script>

<style scoped>

.result-item {
  display: flex;
  justify-content: space-between;
  padding: 30px 20px;
  width: 280px;
  min-height: 300px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  overflow: hidden;
  transition: transform .7s;
  background-color: #f5fbfd;
  order: 2
}

.item {
  /*padding: 30px 20px;*/
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  /*width: 280px;
  min-height: 300px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  overflow: hidden;
  transition: transform .7s;
  background-color: #f5fbfd;
  order: 2*/
}

.result-item:hover {
  transform: scale(1.01);
  transition: all .7s;
}

.item__header {
  text-align: left;
  text-transform: uppercase;
  width: 83%;
  padding-left: 13%;
  font-size: 21px;
  font-weight: 800;
  order: 2
}

.item__address {
  margin-bottom: 20px;
  display: flex;
  justify-content: start;
  gap: 7px;
  width: 100%;
  order: 2
}

.address__img {
  width: 36px;
}

.item__rate {
  margin-bottom: 10px;
  width: 100%;
  order: 2;
  display: flex;
  justify-content: center;
}

.address__text {
  width: 80%;
  min-height: 57px;
  text-align: left;
  display: flex;
  align-items: center;
}

.cards-btn {
  margin-bottom: 10px;
  order: 2
}
.item__description {
  order: 2;
/*  width: 100%;*/
  text-align: left;
  align-self: start;
}

.rate__gray svg, .rate__yellow svg{
  width: 100%;
}

.rate__gray svg use, .rate__yellow svg use {
  width: 100%;
}

.rate__yellow svg use {
  fill: yellow;
}

.showMore {
  width: 93%;
  order: 1;
  transition: all .3ms;
  padding: 40px;
}

.showMore .item {
  width: 65%;
  margin-right: 10px;
  padding: 20px;
}

.showMore .item__header {
  padding-left: 0;
  width: 100%;
  order: 1;
  align-self: start;
}

.showMore .address__text {
  width: 100%;
}

.showMore .item__rate {
  width: 100%;
  margin: 0;
  order: 1;
  align-self: start;

}

.showMore .cards-btn {
  align-self: start;

}

.showMore .item__rate {
  justify-content: start;
}

.reviews {
  display: none;
}

.showMore .reviews {
  display: block;
  width: 50%;
  text-align: left;
}

.reviews__title {
  padding-left: 7%;
  font-weight: 900;
  font-size: 30px;
}


</style>