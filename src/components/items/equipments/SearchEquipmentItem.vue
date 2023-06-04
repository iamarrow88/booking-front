<template>
  <div class="equipment-item">
    <div class="equipment-item__body">
      <div class="equipment-item__about">
        <div class="equipment-item__type-name"><b>{{ type.name }}</b></div>
        <div class="equipment-item__photo-block">
          <img v-if="item.photo" class="equipment-item__photo"
               :src="itemPhotoSrc(item)"
               alt="Item Photo"
               @click="showFullImage(itemPhotoSrc(item))">

          <img v-else class="equipment-item__photo"
               src="../../../assets/no-photo.jpg"
               alt="Item Photo">
        </div>
        <div class="equipment-item__price">Стоимость 1 часа - <span>{{ item.price }} RUB</span></div>
        <div class="equipment-item__summary">
          <div class="summary__duration"
               v-if="!editMode">Аренда на {{ duration }} {{ hoursNaming }}
          </div>
          <div class="summary__total"
               v-if="!editMode">Итого - <span>{{ item.price * duration }} RUB</span></div>
        </div>
      </div>
    </div>

    <div class="buttons">
      <button @click="showPopUp"
              v-if="!editMode"
              class="btn cards-btn action">Забронировать
      </button>
      <button @click="showMore"
              v-if="!editMode"
              class="btn cards-btn">Подробнее
      </button>
      <button v-if="editMode"

              @click="editModalWindowOpen=!editModalWindowOpen"
              class="btn cards-btn">Редактировать
      </button>
      <button v-if="editMode"
              @click="this.$emit('DeleteItem', item.id)"
              class="btn cards-btn">Удалить
      </button>
    </div>

    <teleport to="body">
      <modal-window v-if="editModalWindowOpen" @refreshInventoryArray="closeAndRefreshAddWindow" @closePopUp="editModalWindowOpen=false">
        <div class="modal-equipment-item" :class="{ 'hide': isEditBlockHide }">
          <div class="modal-equipment-item__body">
            <div class="modal-equipment-item__about" :class="{ 'centered': isEditBlockHide }">
              <div class="modal-equipment-item__type-name"><b>{{ type.name }}</b></div>
              <div class="modal-equipment-item__photo-block">
                <img v-if="item.photo" class="modal-equipment-item__photo"
                     :src="itemPhotoSrc(item)"
                     alt="Item Photo">
                <img v-else class="modal-equipment-item__photo"
                     src="../../../assets/no-photo.jpg"
                     alt="Item Photo">
              </div>
              <div class="modal-equipment-item__price">Стоимость 1 часа - <span>{{ item.price }} RUB</span></div>
              <div class="modal-equipment-item__summary">
                <div class="modal-summary__duration"
                     v-if="!editMode">Аренда на {{ duration }} {{ hoursNaming }}
                </div>
                <div class="modal-summary__total"
                     v-if="!editMode">Итого - <span>{{ item.price * duration }} RUB</span></div>
              </div>
            </div>
          </div>
          <div class="modal-inventory-card" v-if="isEditBlockShow">
            <inventory-card :IsEditEquipmModeOnFParent="editMode"
            :resortIdFromParent="resortId"
            :itemFromParent="item"
            @refreshInventoryArray="closeAndRefreshAddWindow"
            @closeAndRefreshAddWindow="editModalWindowOpen=false"></inventory-card>
          </div>
          <div class="buttons" v-if="!isEditBlockShow">
            <button @click="showPopUp"
                    v-if="!editMode"
                    class="btn cards-btn action">Забронировать
            </button>
            <button @click="showMore"
                    v-if="!editMode"
                    class="btn cards-btn">Отмена
            </button>
          </div>
        </div>
      </modal-window>
    </teleport>

    <teleport to="body">
      <confirm-window v-if="!editMode" :item="item"
                      :typeName="type.name"
                      :isBookingProcessStarted="isBookingProcessStarted"
                      :resortName="resortName"
                      :selDateStartShort="selDateStartShort"
                      :selDateEndShort="selDateEndShort"
                      :startTime="startTime"
                      :endTime="endTime"
                      :total="total"
                      :duration="duration"
                      class="pop-up__confirm"
                      @closePopUp="closePopUp"></confirm-window>
    </teleport>
    <teleport to="body">
      <success-window :isOpen="isBooked" @closePopUp="closePopUp"></success-window>
    </teleport>

  </div>
</template>

<script>


import ConfirmWindow from "@/components/blocks/modal/ConfirmWindow.vue";
import SuccessWindow from "@/components/blocks/modal/SuccessWindow.vue";
import InventoryCard from "@/components/items/equipments/InventoryCard.vue";
import StarsRate from "@/components/UI/StarsRate.vue";
import ReviewBlock from "@/components/blocks/start-page/ReviewBlock.vue";
import {comments} from "@/data-and-functions/constants/URLS";
import asyncRequest from "@/data-and-functions/API/asyncRequest";
import {mapGetters} from "vuex";
import ModalWindow from "@/components/blocks/modal/ModalWindow.vue";


export default {
  components: ConfirmWindow, SuccessWindow, InventoryCard, StarsRate, ReviewBlock, ModalWindow,
  name: "SearchEquipmentItem",
  props: {
    item: {
      id: Number,
      photo: String,
      price: Number,
      resort_id: Number,
      type_id: Number,
      inventory_name: String,
    },
    resortId: Number,
    typeId: Number,
    resortName: String,
    editMode: Boolean,
    selDateStartShort: null,
    selDateEndShort: null,
    startTime: String,
    endTime: String,
    duration: Number,
    hoursNaming: String,
  },
  data() {
    return {
      type: null,
      isBookingProcessStarted: false,
      isBooked: false,
      isAddingItemModeOn: false,
      itemsCounter: 0,
      today: null,
      componentDuration: null,
      users: [],
      reviews: [],
      currentReview: 0,
      showAddComment: false,
      refreshCommentID: 0,

      editModalWindowOpen: false,
      isFirstPriceShown: false,
      showCreateComment: false,

      isEditBlockShow: false,
      isEditBlockHide: false,
    }
  },
  watch: {
    itemsCounter() {
      this.getInventoryByResort();
    },
    startTime() {
      this.componentDuration = this.calcDuration();
    },
    endTime() {
      this.componentDuration = this.calcDuration();
    },
    currentReview() {
      this.showAddComment = this.currentReview === this.reviews.length;
    }
  },
  computed: {
    ...mapGetters(['GET_ALL_USER_INFO', 'GET_INVENTORY_TYPES']),
    total() {
      return this.item.price * this.duration;
    }
  },
  methods: {
    showFullImage(src) {
      this.fullImageSrc = src;
      this.popupVisible = true;
    },
    closePopupImage() {
      this.popupVisible = false;
    },
    closeMorePopup() {
      this.morePopupVisible = false;
    },
    itemPhotoSrc(item) {
      if (item.photo) {
        const mimeType = this.getMimeTypeFromFilename(item.inventory_name);
        return 'data:' + mimeType + item.photo
      }
      return null;
    },
    getMimeTypeFromFilename(filename) {
      const extension = filename.split('.').pop().toLowerCase();
      const mimeTypes = {
        'jpg': 'image/jpeg;base64,',
        'jpeg': 'image/jpeg;base64,',
        'png': 'image/png;base64,',
        'gif': 'image/gif;base64,',
        'bmp': 'image/bmp;base64,',
        'webp': 'image/webp;base64,',
      };
      return mimeTypes[extension] || 'application/octet-stream';
    },
    async getReviewsByInventoryID() {
      try {
        const res = await fetch(`${comments.getCommentsByInventoryID.URL}${this.item.id}`);
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
      if (this.showCreateComment) {
        if (this.currentReview < 0) this.currentReview = this.reviews.length;
      } else {
        if (this.currentReview < 0) this.currentReview = this.reviews.length - 1;
      }
    },
    next() {
      this.currentReview += 1;
      if (this.showCreateComment) {
        if (this.currentReview > this.reviews.length) this.currentReview = 0;
      } else {
        if (this.currentReview > this.reviews.length - 1) this.currentReview = 0;
      }
    },
    async deleteComment(id) {
      console.log('deleteComment');

      try {
        const res = await asyncRequest(`${comments.deleteCommentByID.URL}${id}`, undefined, comments.deleteCommentByID.METHOD, {
          'Content-Type': 'application/json',
          'Accept': '*',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        })

        if (res.ok) {
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
    async postComment(comment) {
      const body = {
        "inventory_id": +this.item.id,
        "rating": +comment.rating,
        "text": comment.text,
      }

      try {
        const res = await asyncRequest(comments.createComment.URL, body, comments.createComment.METHOD, {
          'Content-Type': 'application/json',
          'Accept': '*',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        });
        console.log('комментарий отправлен');
        if (!res.ok) {
          console.log('комментарий не создан, ошибка.');
        } else {
          console.log('Комментарий отправлен');
          const comment = await res.json();
          console.log(comment);
          /*this.currentReview += 1;*/
          await this.getReviewsByInventoryID();
          this.currentReview = 0;
        }
      } catch (e) {
        console.error(e);
      }
    },

    showMore() {
      this.editModalWindowOpen = !this.editModalWindowOpen;
    },

    getEquipmentType() {
      this.GET_INVENTORY_TYPES.forEach(type => {
        if (type.id === this.item.type_id) {
          this.type = type;
        }
      })
    },
    showPopUp() {
      this.editModalWindowOpen = false;
      this.isBookingProcessStarted = !this.isBookingProcessStarted;
    },
    closePopUp(bool1, bool2) {
      this.isBookingProcessStarted = bool1;
      this.isBooked = bool2;
    },
    closeAndRefreshAddWindow() {
      this.editModalWindowOpen = false;
      this.$emit('refreshInventoryArray');
    },
    async getInventoryByResort() {
      try {
        const equipments = await fetch(`/api/resorts/inventories/${this.resortId}`);
        this.equipments = await equipments.json();
        if (equipments.ok) {
          console.log('получили данные по инвентарю с курорта ' + this.resortName);
        } else {
          console.log('не удалось получить данные по инвентарю с курорта ' + this.resortName);
        }
      } catch (e) {
        console.error(e);
      }
    },
    calcDuration() {
      const msPerHours = 60 * 60 * 1000;
      const start = new Date(this.selDateStartShort + ' ' + this.startTime + ':00:00');
      const end = new Date(this.selDateEndShort + ' ' + this.endTime + ':00:00');
      return (end - start) / msPerHours
    },


  },
  async created() {
    this.getEquipmentType();
    this.today = (new Date().toISOString().slice(0, 10));
    this.componentDuration = this.$route.query.duration;
    await this.getReviewsByInventoryID();
    this.isEditBlockShow = !!this.$route.path.split('/').includes('manage');
    this.isEditBlockHide = !this.isEditBlockShow;
  },

}

</script>

<style>
.equipment-item {
  padding: 40px;
  border: 0 solid #899bb0;
  box-shadow: 7px 7px 20px #c5daf3;
  font-size: 1.25rem;
  order: 2;
  transition: all .3ms;
}

.equipment-item__body {
  width: 100%;
  height: 90%;
  display: flex;
  justify-content: center;
}

.equipment-item__about {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.equipment-item__photo-block {
  margin: 0 auto 30px;
  width: 50%;
  height: 250px;
  display: flex;
  order: 2;
  justify-content: center;
}

.equipment-item__photo {
  width: 100%;
  object-fit: contain;
}

.equipment-item__price {
  margin-bottom: 10px;
  display: flex;
  justify-content: flex-start;
  order: 2;
}

.equipment-item__summary {
  margin-bottom: 25px;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  gap: 10px;
  width: 100%;
  order: 2;
}

.reviews__title {
  padding-left: 7%;
  font-weight: 900;
  font-size: 30px;
}

.reviews__no-reviews {
  margin-top: 45px;
}

/*.no-scroll {
  overflow: hidden;
  background-color: rgba(178, 178, 178, .3);
  z-index: 10;
}*/

.buttons {
  display: flex;
  flex-direction: column;
  width: 55%;
  margin: 1em auto 0;
  justify-content: center;
  gap: 1em;
}

.inventory-edit {
  display: none;
}*/

/*
.equipment.inventory-card {
  padding: 1em;
}
*/

/*.inventory-card__title {
  display: none;
}

.pop-up__block {
  width: 65%;
}*/

.pop-up__block > .modal-equipment-item {
  justify-content: space-around;
}

/*.display-grid{
  padding: 2em;
  display: grid;
  grid-template-columns: 2fr 3fr ;
}*/

.modal-equipment-item {
  display: flex;
  justify-content: center;
  align-items: center;
}

.hide {
  flex-direction: column;
}

.modal-equipment-item {
  display: flex;
  gap: 2em;
}

.modal-equipment-item__about {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 1em;
  font-size: 18px;
}

.centered {
  align-items: center;
}

.modal-equipment-item__type-name {
  font-size: 28px;
}

.modal-equipment-item__photo-block {
  width: 92%;
  height: 350px;
  display: flex;
  justify-content: center;
}

.modal-equipment-item__photo {
  max-height: 100%;
  max-width: 100%;
}

.modal-reviews__title {
  font-size: 26px;
}

.modal-equipment-item__reviews > .active {
  width: auto;
}

.modal-inventory-card > .inventory-card {
  padding: 0;
}

.modal-inventory-card > .inventory-card > label{
  margin: 0.7em 0;
}

.modal-inventory-card > .inventory-card > .create-price-input {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #d8d8d8;
  transition: border-color 0.2s ease-in-out;
}

.modal-inventory-card > .inventory-card > .buttons {
  width: 100%;
  margin: 0.7em 0 0;
  flex-direction: row;
}

.modal-inventory-card > .inventory-card > .buttons > button {
  margin: 0;
  height: auto;
}

.modal-inventory-card > .inventory-card > .create-title {
  font-size: 2em;
  margin-bottom: 1em;
}

.active > .block__btns {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  gap: 0.5em;
}

.active > .block__btns > button {
  width: 47%;
}

.modal-buttons {
  display: flex;
  justify-content: center;
  gap: 1em;
}

.modal-buttons > button {
  width: 40%;
}

.pop-up__confirm > .pop-up__block {
  width: 30%;
  height: 15em;
}

@media (max-width: 767px) {

  /*.equipment-item {
    font-size: 1rem;
    width: 23%;
  }*/

  .equipment-item__type-name {
    font-size: 1.25rem;
  }
}


.popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.popup-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;

}

.popup-content {
  position: relative;
  background-color: #ffffff;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.close {
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
}

.cards-btn {
  width: 100%; /* Задайте ширину кнопок */
  height: 40px; /* Задайте высоту кнопок */
  display: inline-block;
  border: 2px solid #fba91c;
  color: #fba91c;
  text-align: center;
  font-size: 14px;
  cursor: pointer;
  margin: 5px;
  transition: background-color 0.3s ease;
}

</style>
