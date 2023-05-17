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

      <button @click="showMore"
              class="cards-btn">Подробнее
      </button>
<!--      <p class="item__description" v-if="isMoreShown">
        <b>Описание:</b> {{ resort.description }}
      </p>-->
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

            <button
                @click="goToResortPage"
                class="cards-btn">
              Посмотреть инвентарь
            </button>
          </div>
        </modal-window>
      </teleport>


      <button
          @click="goToResortPage"
          class="cards-btn">
        Посмотреть инвентарь
      </button>

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
      /*console.log(e);*/
      this.isMoreShown = !this.isMoreShown;
      /*      if([...e.target.closest('.result-item').classList].includes('showMore')) {
              e.target.closest('.result-item').classList.remove('showMore');
            } else {
              document.querySelectorAll('.result-item').forEach(card => card.classList.remove('showMore'));
              e.target.closest('.result-item').classList.add('showMore');
            }*/

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
    /*async deleteComment(id){
      console.log('deleteComment');

      const body = {
        id: +id,
      }
      console.log(body);
      try {
        const res = await asyncRequest(`${comments.deleteCommentByID.URL}${id}`, undefined, comments.deleteCommentByID.METHOD, headerWithToken)

        if(res.ok){
          console.log(res);
          console.log('комментарий удален');
          this.currentReview -= 1;
          await this.getReviewsByInventoryID();
        } else {
          console.log(res);

          console.log('комментарий не удален, ошибка');
        }
      } catch (e) {
        console.error(e)
      }
    },
    async postComment(comment){
      const body = {
        "resort_id": +this.resort.id,
        "rating": +comment.rating,
        "text": comment.text,
      }

      try {
        const res = await asyncRequest(comments.createComment.URL, body, comments.createComment.METHOD, headerWithToken);
        console.log('комментарий отправлен');
        if(!res.ok){
          console.log('комментарий не создан, ошибка.');
        } else {
          console.log('Комментарий отправлен');
          const comment = await res.json();
          console.log(comment);
          this.currentReview += 1;
          await this.getReviewsByInventoryID();
        }
      } catch (e) {
        console.error(e);
      }
    },*/
  },
  mounted() {
    this.getUsers();
    this.getReviewsByResortID();
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
  width: 100%;
  padding-left: 13%;
  font-size: 21px;
  font-weight: 800;
  order: 2
}

.item__address {
  margin-bottom: 20px;
  display: flex;
  justify-content: flex-start;
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

.rate__gray svg, .rate__yellow svg {
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
  width: 45%;
  text-align: left;
}

.reviews__title {
  padding-left: 7%;
  font-weight: 900;
  font-size: 30px;
}


</style>
