<template>
  <div class="block">
    <div class="block__btns">
      <button class="up" @click="previous">Previous</button>
      <button class="down" @click="next">Next</button>
    </div>
    <div class="review">
      <div class="review__author"><img src='../../../assets/admin.png' alt="avatar" class="author__img">
        <div class="author__name">{{user.name}}</div>
      </div>
      <div class="review__title">{{review.title}}</div>
      <div class="review__text">
        {{review.body}}
      </div>
      <div class="review__date">22/04/22</div>
    </div>
  </div>

</template>

<script>
export default {
  name: "ReviewBlock",
  props: {
    users: [],
    review: {
      userId: Number,
      id: Number,
      title: String,
      body: String
    }
  },
  data() {
    return {
      user: {},
      currentReviewId: null,
      currentUserId: null,
    }
  },
  methods: {
    findReviewAuthor(userId){
      for(let i = 0; i < this.users.length; i++) {
        if (userId === this.users[i].id){
          this.user = this.users[i];
        }
      }
    },
    previous(){
      this.$emit('prev');
    },
    next(){
      this.$emit('next');
    }
  },
  mounted() {
    this.findReviewAuthor(this.review.userId);
  }
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

</style>