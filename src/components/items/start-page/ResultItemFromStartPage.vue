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
        <stars-rate :rate="Math.round(resort.avg_rating)"></stars-rate>
      </div>

      <div class="buttons">
        <button
            @click="goToResortPage"
            class="cards-btn action">
          Посмотреть инвентарь
        </button>

        <button @click="showMore"
                class="cards-btn">Подробнее
        </button>
      </div>

      <teleport to="body">
        <modal-window v-if="isMoreShown" @closePopUp="isMoreShown=false">
          <div class="item">
            <div class="item__header">{{ resort.name }}</div>
            <div class="item__address">
              <img class="address__img" src="../../../assets/icons/map-pin.svg" alt="pin">
              <p class="address__text">
                {{ resort.address }}
              </p>
            </div>
            <div class="item__rate">
              <stars-rate :rate="Math.round(resort.avg_rating)"></stars-rate>
            </div>
            <p class="item__description">
              <b>Описание:</b> {{ resort.description }}
            </p>

            <button class="cards-btn" @click="isMoreShown=false"> Назад </button>
          </div>
        </modal-window>
      </teleport>
    </div>
    <div class="reviews">
      {{resort.description}}
    </div>
  </li>
</template>

<script>
import starsRate from "@/components/UI/StarsRate.vue";
import ReviewBlock from "@/components/blocks/start-page/ReviewBlock.vue";
import {comments} from "@/data-and-functions/constants/URLS";
import ModalWindow from "@/components/blocks/modal/ModalWindow.vue";

export default {
  name: "ResultItemFromStartPage",
  components: starsRate, ReviewBlock, ModalWindow,
  props: {
    resort: {
      id: Number,
      name: String,
      city_id: Number,
      owner_id: Number,
      description: String,
      address: String,
      rate: Number,
      avg_rating: Number,
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
  },
  data() {
    return {
      isMoreShown: false,
      users: [],
      reviews: [],
      currentReview: 0,
      showAddComment: false,
    }
  },
  watch: {
    currentReview() {
      this.showAddComment = this.currentReview === this.reviews.length;
    },
    selDateStartShort(newDate) {
      this.$store.commit('setStartDate', newDate);
    },
    selDateEndShort(newDate) {
      this.$store.commit('setEndDate', newDate);
    },
    startTime(newTime) {
      this.$store.commit('setStartTime', newTime);
    },
    endTime(newTime) {
      this.$store.commit('setEndTime', newTime);
    },
    selectedType(newInvType) {
      this.$store.commit('setSelectedInvType', newInvType);
    },
  },
  methods: {
    goToResortPage() {
      this.$store.commit('setSelectedResort', this.resort);


      this.$router.push({
        path: '/resorts/' + this.resort.id, query:
            {
              type_id: this.selectedType.id,
              selectedCityId: this.selectedCity.id,
              selDateStartShort: this.selDateStartShort,
              selDateEndShort: this.selDateEndShort,
              startTime: this.startTime,
              endTime: this.endTime,
              duration: this.duration
            }
      })
    },

    showMore() {
      this.isMoreShown = !this.isMoreShown;
    },
    async getUsers() {
      try {
        const res = await fetch('https://jsonplaceholder.typicode.com/users');
        if (res.ok) {
          this.users = await res.json();
        } else {
          console.log('there is no users')
        }
      } catch (e) {
        console.error(e);
      }
    },
    async getReviewsByResortID() {
      try {
        const res = await fetch(comments.getCommentsByResortID.URL + this.resort.id);
        if (res.ok) {
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
      console.log('prev' + this.currentReview);
      if (this.currentReview < 0) this.currentReview = this.reviews.length;
    },
    next() {
      this.currentReview += 1;
      console.log('next' + this.currentReview);
      if (this.currentReview > this.reviews.length) this.currentReview = 0;

    },
  },
  mounted() {
    this.getUsers();
    this.getReviewsByResortID();
  }
}
</script>

<style>

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
}

.item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.result-item:hover {
  transform: scale(1.01);
  transition: all .7s;
}

.item__header {
  text-align: left;
  text-transform: uppercase;
  width: 100%;
  padding-left: 13%;
  font-size: 21px;
  font-weight: 800;
}

.item__address {
  margin-bottom: 20px;
  display: flex;
  justify-content: flex-start;
  gap: 7px;
  width: 100%;
}

.address__img {
  width: 36px;
}

.item__rate {
  margin-bottom: 10px;
  width: 100%;
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
}

.item__description {
  text-align: left;
  align-self: start;
}

.rate__gray svg, .rate__yellow svg {
  width: 100%;
}

.rate__gray svg use, .rate__yellow svg use {
  width: 100%;
}

.rate__yellow svg use {
  fill: yellow;
}

.reviews {
  display: none;
}

.buttons {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 0.5em;
}

.buttons > button {
  height: auto;
}

.item > .cards-btn {
  margin: 0 auto;
  width: 50%;
}
</style>
