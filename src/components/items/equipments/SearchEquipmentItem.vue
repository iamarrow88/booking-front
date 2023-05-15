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

        <div class="popup" v-show="popupVisible">
          <div class="popup-container">
            <div class="popup-content">
              <span class="close" @click="closePopup">&times;</span>
              <img :src="fullImageSrc" alt="Full Image" @click="closePopup">
            </div>
          </div>
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

      <div class="equipment-item__reviews" data-refresh="0">
        <div class="reviews__title">Отзывы</div>
        <div v-if="reviews.length===0" class="reviews__no-reviews">Пока отзывов нет</div>
        <review-block v-for="review in reviews"
                      :review="review"
                      :key="review.id"
                      :class="{active: review.index === this.currentReview}"
                      @prev="prev"
                      @next="next"
                      @deleteComment="deleteComment"></review-block>
        <create-comment v-if="showAddComment"
                        @postComment="postComment"
                        @next="next">добавьте комментарий
        </create-comment>

      </div>
    </div>

    <div class="buttons">
      <button @click="showPopUp"
              v-if="!editMode"
              class="btn cards-btn">Забронировать
      </button>
      <button @click="showMore"
              v-if="!editMode"
              class="btn cards-btn">Подробнее
      </button>
      <button v-if="editMode"
              @click="showAddItemBlock"
              class="btn cards-btn">Редактировать
      </button>
      <button v-if="editMode"
              @click="this.$emit('DeleteItem', item.id)"
              class="btn cards-btn">Удалить
      </button>
    </div>
    <div class="popup" v-show="morePopupVisible">
      <div class="popup-container">
        <div class="popup-content">
          <span class="close" @click="closeMorePopup">&times;</span>
          <!-- Здесь вы можете добавить содержимое попапа "Подробнее" -->
          <p>Подробная информация о товаре...</p>

        </div>
      </div>
    </div>

    <div v-if="isAddingItemModeOn">
      <inventory-card :IsEditEquipmModeOnFParent="true"
                      :resortIdFromParent="resortId"
                      :itemFromParent="item"
                      @isAddItemBlockOpen="closeAddItem"></inventory-card>
    </div>


    <div v-if="isAddingItemModeOn">
      <inventory-card :IsEditEquipmModeOnFParent="true"
                      :resortIdFromParent="resortId"
                      :itemFromParent="item"
                      @isAddItemBlockOpen="closeAddItem"></inventory-card>
    </div>

    <teleport to="body">
      <confirm-window v-if="!editMode" :item="item"
                      :typeName="type.name"
                      :isBookingProcessStarted="isBookingProcessStarted"
                      :resortName="resortName"
                      :selDateStartShort="selDateStartShort"
                      :selDateEndShort="selDateEndShort"
                      :startTime="startTime"
                      :endTime="endTime"
                      :total="item.price * duration"
                      :duration="duration"
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
import {comments, headerWithToken} from "@/data-and-functions/constants/URLS";
import asyncRequest from "@/data-and-functions/API/asyncRequest";
import {mapGetters} from "vuex";


export default {
  components: ConfirmWindow, SuccessWindow, InventoryCard, StarsRate, ReviewBlock,
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

      popupVisible: false,
      fullImageSrc: '',
      morePopupVisible: false,

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
  },
  methods: {
    showFullImage(src) {
      this.fullImageSrc = src;
      this.popupVisible = true;
    },
    closePopup() {
      this.popupVisible = false;
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
      if (this.currentReview < 0) this.currentReview = this.reviews.length;
    },
    next() {
      this.currentReview += 1;
      if (this.currentReview > this.reviews.length) this.currentReview = 0;
    },
    async deleteComment(id) {
      console.log('deleteComment');

      try {
        const res = await asyncRequest(`${comments.deleteCommentByID.URL}${id}`, undefined, comments.deleteCommentByID.METHOD, headerWithToken)

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
        const res = await asyncRequest(comments.createComment.URL, body, comments.createComment.METHOD, headerWithToken);
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
      /*      if ([...e.target.closest('.equipment-item').classList].includes('showMore')) {
              e.target.closest('.equipment-item').classList.remove('showMore');
            } else {
              document.querySelectorAll('.equipment-item').forEach(card => card.classList.remove('showMore'));
              e.target.closest('.equipment-item').classList.add('showMore');
            }*/
      this.morePopupVisible = true;
    },
    closeMorePopup() {
      this.morePopupVisible = false;
    },

    getEquipmentType() {
      this.GET_INVENTORY_TYPES.forEach(type => {
        if (type.id === this.item.type_id) {
          this.type = type;
        }
      })
    },
    showPopUp() {
      this.isBookingProcessStarted = !this.isBookingProcessStarted;
    },
    closePopUp(bool1, bool2) {
      this.isBookingProcessStarted = bool1;
      this.isBooked = bool2;
    },
    showAddItemBlock() {
      this.isAddingItemModeOn = !this.isAddingItemModeOn;
    },
    closeAddItem(bool) {
      this.isAddingItemModeOn = bool;
      this.itemsCounter += 1;
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
  },

}

</script>

<style scoped>
.equipment-item {
  padding: 40px;
  border: 0 solid #899bb0;
  box-shadow: 7px 7px 20px #c5daf3;
  font-size: 1.25rem;
  order: 2;
  transition: all .3ms;
}

.equipment-item.showMore {
  padding: 40px 84px;
  width: 100%;
  transition: all .3ms;
  order: 1;
}

.equipment-item__body {
  width: 100%;
  height: 90%;
  display: flex;
  justify-content: center;
}

.showMore .equipment-item__body {
  justify-content: space-between;
}

.equipment-item__about {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.showMore .equipment-item__about {
  width: 65%;
  flex-wrap: wrap;
}

.equipment-item__type-name {
  margin-bottom: 20px;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  font-size: 28px;
  order: 2;
}

.showMore .equipment-item__type-name {
  margin-top: 40px;
}

.equipment-item__photo-block {
  margin: 0 auto 30px;
  width: 90%;
  min-height: 150px;
  display: flex;
  order: 2;
  justify-content: center;
}

.showMore .equipment-item__photo-block {
  order: 1;
  width: auto;
  height: 100%;
  justify-content: flex-start;
}

.equipment-item__photo {
  max-width: 100%;
  height: 200px; /* Задайте высоту, которую вы хотите */
  object-fit: cover;
}

.showMore .equipment-item__photo {
  height: 100%;
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

.equipment-item__reviews {
  display: none;
  min-width: 35%;
}

.showMore .equipment-item__reviews {
  display: block;
}

.reviews__title {
  padding-left: 7%;
  font-weight: 900;
  font-size: 30px;
}

.reviews__no-reviews {
  margin-top: 45px;
}

.no-scroll {
  overflow: hidden;
  background-color: rgba(178, 178, 178, .3);
  z-index: 10;
}

.buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
}


@media (max-width: 767px) {

  .equipment-item {
    font-size: 1rem;
  }

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
