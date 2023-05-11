<template>
  <div class="comment_block">
    <div v-if="!isCommentAdded" class="add-comment">
      <div class="add-comment__title">Ваша оценка:</div>

      <form class="add-comment__rating">
        <label for="1" class="label-img">☆</label>
        <label for="2" class="label-img">☆</label>
        <label for="3" class="label-img">☆</label>
        <label for="4" class="label-img">☆</label>
        <label for="5" class="label-img">☆</label>
        <input type="radio" name="rate" value="1" id="1" v-model="rating">
        <input type="radio" name="rate" value="2" id="2" v-model="rating">
        <input type="radio" name="rate" value="3" id="3" v-model="rating">
        <input type="radio" name="rate" value="4" id="4" v-model="rating">
        <input type="radio" name="rate" value="5" id="5" v-model="rating">
      </form>
      <div v-if="isErrorOccurred" class="error-message">Поставьте, пожалуйста, оценку</div>
      <textarea placeholder="Напишите ваш комментарий..."
                class="add-comment__text"
                v-model="text"></textarea>
    </div>
    <div v-else class="comment-block__else">
      <div class="else__text">Спасибо! Ваш комментарий отправлен на проверку</div>
    </div>
    <div class="buttons">
      <button v-if="!isCommentAdded" class="btn cards-btn" @click="postComment">Отправить</button>
      <button class="btn cards-btn" :class="{added: isCommentAdded}" @click="this.$emit('next')">Еще комментарии</button>
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
      labels: [],
      isErrorOccurred: false
    }
  },
  watch: {
    rating(){
      this.labels.forEach((label, index) => label.innerHTML = (index + 1) <= +this.rating ? '★' : '☆');
    }
  },
  methods: {
    postComment(){
      if(this.rating){
        const body = {
          text: this.text,
          rating: this.rating,
          };
        console.log(body);
        this.$emit('postComment', body);
        this.isCommentAdded = true;
        this.isErrorOccurred = false;
      } else {
        this.isErrorOccurred = true;
      }
    },
    getShortDate(fullDate) {
      return (fullDate.toISOString().slice(0, 10));
    },
    getTimeNumber(dateFull) {
      console.log(dateFull);
      let timeNumber = dateFull.toString().split(' ')[4];
      return timeNumber;
    },
  },
  mounted() {
    this.labels = document.querySelectorAll('.label-img');
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
  min-height: 17vw;
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

input {
  display: none;
}

.label-img {
  font-size: 48px;
  color: goldenrod;
}

.error-message {
  margin: 0 0 15px 0;
  text-align: left;
}
</style>
