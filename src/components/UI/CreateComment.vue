<template>
  <div class="comment_block">
    <div v-if="!isCommentAdded" class="add-comment">
      <div class="add-comment__title">Ваша оценка:</div>
      <form class="add-comment__rating">
        <!--      <label for="1">
              <img src="../../assets/25533.png" alt="1">

              </label>-->
        <input type="radio" name="rate" value="1" id="1" v-model="rating">
        <input type="radio" name="rate" value="2" id="2" v-model="rating">
        <input type="radio" name="rate" value="3" id="3" v-model="rating">
        <input type="radio" name="rate" value="4" id="4" v-model="rating">
        <input type="radio" name="rate" value="5" id="5" v-model="rating">
      </form>
      <textarea placeholder="Напишите ваш комментарий..."
                class="add-comment__text"
                v-model="text"></textarea>
    </div>
    <div v-else class="comment-block__else">
      <div class="else__text">Спасибо! Ваш комментарий отправлен на проверку</div>
    </div>
    <div class="buttons">
      <button v-if="!isCommentAdded" class="btn cards-btn" @click="postComment">Отправить</button>
      <button class="btn cards-btn" :class="{added: isCommentAdded}" @click="this.$emit('prev')">Еще комментарии</button>
    </div>
  </div>
</template>

<script>

export default {
  name: "CreateComment",
  props: {

  },
  data() {
    return {
      text: '',
      rating: null,
      isCommentAdded: false,
    }
  },
  methods: {
    postComment(){
      const body = {
        text: this.text,
        rating: this.rating,
        created_at: new Date(),
      };
      this.$emit('postComment', body);
      this.isCommentAdded = true;
    },
    getShortDate(fullDate) {
      return (fullDate.toISOString().slice(0, 10));
    },
  }
}
</script>

<style scoped>

.comment_block {
  padding: 35px;
}

.add-comment__title {
  text-align: left;
  font-size: 18px;
  font-weight: 500;
}
.add-comment__rating {
  padding: 10px 2px;
  display: flex;
  justify-content: flex-start;
  gap: 5px;
}

.add-comment__text {
  margin-bottom: 15px;
  padding: 5px;
  display: block;
  width: 83%;
  height: 150px;
  resize: none;
}

.else__text {
  margin-bottom: 30px;
}

.buttons {
  width: 83%;
  display: flex;
  justify-content: flex-start;
  gap: 15px;
}

.buttons .added {
  margin-left: 3em;
}
</style>
