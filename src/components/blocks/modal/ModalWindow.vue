<template>
  <div class="pop-up" @click="closePopUp" ref="pop-up">
    <div class="pop-up__block" ref="pop-up__block">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "ModalWindow",
  props: {
    wideWindow: Boolean,
  },
  watch: {
    wideWindow() {
      this.$refs["pop-up__block"].classList.add('wide');
    }
  },
  methods: {
    closePopUp(e){
      if([...e.target.classList].includes('pop-up')) this.$emit('closePopUp')
    }
  },
}
</script>

<style>
  .pop-up__block.wide {
    display: block;
    position: absolute;
    left: 20px;
    top: 40px;
    bottom: 40px;
    right: 20px;
    transform: none;
  }

  .wide .modal-equipment-item {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
  }

  .wide .modal-equipment-item__body {
    grid-row: 1 / span 2;
    grid-column: 1 / span 2;
  }

  .wide .modal-equipment-item .review {
    display: block;
    grid-row: 1 / span 2;
    grid-column: 3 / span 3;
  }

  .wide .buttons {
    grid-row: 3 / span 1;
    grid-column: 1 / span 5;
    width: 70%;
    display: flex;
    flex-direction: row;
  }

  @media (max-width: 860px) {
    .wide .block__btns {
      flex-direction: column;
    }
    .wide .buttons {
      width: 50vw;
      flex-direction: column;
    }
  }
</style>
