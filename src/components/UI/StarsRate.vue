<template>
  <div class="rating">
    <div class="star" id="rating-5" ref="rating5">
      <svg class="icon">
        <use xlink:href="../../assets/icons/sprite.svg#rating-star-4"></use>
      </svg>
    </div>
    <div class="star" id="rating-4" ref="rating4">
      <svg class="icon">
        <use xlink:href="../../assets/icons/sprite.svg#rating-star-3"></use>
      </svg>
    </div>
    <div class="star" id="rating-3" ref="rating3">
      <svg class="icon">
        <use xlink:href="../../assets/icons/sprite.svg#rating-star-2"></use>
      </svg>
    </div>
    <div class="star" id="rating-2" ref="rating2">
      <svg class="icon">
        <use xlink:href="../../assets/icons/sprite.svg#rating-star-1"></use>
      </svg>
    </div>
    <div class="star" id="rating-1" ref="rating1">
      <svg class="icon">
        <use xlink:href="../../assets/icons/sprite.svg#rating-star-0"></use>
      </svg>
    </div>
  </div>
</template>

<script>
export default {
  name: "StarsRate",
  props: {
    rate: Number
  },
  methods: {
    applyRate(rate) {
      for (let i = 0; i < rate; i++) {
        const star = Object.keys(this.$refs).reverse()[i];
        this.$refs[star].classList.add('marked-star');
      }
    }
  },
  mounted() {
    this.applyRate(this.rate);
  }
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.rating {
  margin-bottom: 15px;
  padding: 5px;
  display: flex;
  width: 10em;
  justify-content: flex-start;
  flex-direction: row-reverse;
  height: 2em;
  position: relative;
}

.rating > input {
  display: none;
}

.rating > .star {
  cursor: pointer;
  width: 40px;
  height: 40px;
}

.rating > .star svg {
  width: 100%;
  height: 100%;
}

.rating > .star svg use {
  width: 100%;
  height: 100%;
  fill: #d0cece;
}

.rating > .star.marked-star svg use {
  fill: #fb946d;
}

</style>
