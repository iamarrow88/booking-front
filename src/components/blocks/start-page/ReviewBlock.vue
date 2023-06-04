<template>
  <div class="block">
    <div class="review">
      <div class="review__author"><img src='../../../assets/admin.png' alt="avatar" class="author__img">
        <div class="author__name">{{ review.user_name ? review.user_name : "Аноним" }}</div>
      </div>
      <div class="review__rate">
        <stars-rate :rate="this.review.rating"></stars-rate>
      </div>
      <div class="review__text">
        {{ review.text }}
      </div>
      <div class="review__date">{{ review.createdAt }}</div>
    </div>
    <div class="review__counter"> 1 из {{ reviewsLength }}</div>
    <div class="block__btns">
      <button class="up" @click="previous">Предыдущий</button>
      <button class="down" @click="next">Следующий</button>
      <button class="down" @click="deleteComment" v-if="review.user_id===+this.GET_ALL_USER_INFO.id">Удалить</button>
    </div>
  </div>

</template>

<script>
import StarsRate from "@/components/UI/StarsRate.vue";
import {mapGetters} from "vuex";

export default {
  name: "ReviewBlock",
  components: StarsRate,
  props: {
    review: {
      id: Number,
      userId: Number,
      inventory_id: Number,
      rating: Number,
      text: String,
      createdAt: String,
      user_name: String,
    },
    reviewsLength: Number,
  },
  data() {
    return {
      user: {
        id: Number,
        name: String,
        username: String,
        email: String,
        address: Object,
        phone: String,
        website: String,
        company: Object
      },
      currentReviewId: null,
      currentUserId: null,
    }
  },
  computed: {
    ...mapGetters(['GET_ALL_USER_INFO'])
  },
  methods: {
    previous() {
      this.$emit('prev');
    },
    next() {
      this.$emit('next');
    },
    deleteComment(){
      this.$emit('deleteComment', this.review.id)
    }
  },
}
</script>

<style scoped>
.block {
  width: 27vw;
  padding: 30px;
  display: none;
}

.block__btns {
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  width: 17vw;
}

button {
  width: 100px;
  display: flex;
  justify-content: center;
  color: #fb946d;
  margin: 0 auto;
}

button:hover {
  color: #fff;
}

.review {
  width: 80%;
  padding: 50px;
  margin: 30px 0;
  border: 1px solid #d0cece;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
}

.review__author {
  width: 4em;
}

.author__img {
  width: 100%;
  margin-bottom: 10px;
}

.author__name {
  font-weight: 700;
  font-size: 24px;
  width: 17em;
  margin-bottom: 15px;
}

.review__title {
  font-size: 34px;
  text-transform: uppercase;
  margin-bottom: 10px;
}

.review__text {
  font-style: italic;
  margin-bottom: 20px;
}

.review__date {
  font-weight: 700;
}

.active {
  display: block;
}

.review__counter {
  margin-bottom: 1em;
  width: 100%;
  text-align: center;
  font-size: 20px;
}

</style>
