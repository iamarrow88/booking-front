<template>
  <div class="user-block">
    <div class="profile" v-key="GET_UPDATE_KEY">
      <div class="profile-photo">
        <img class="avatar" src="../../../assets/user.png" v-if="!IS_USER_OWNER" alt="avatar">
        <img class="avatar" v-if="IS_USER_OWNER" src="../../../assets/admin.png" alt="avatar">

        <p class="avatar__info">{{ GET_ALL_USER_INFO.surname }}</p>
      </div>
      <div class="user-data">
        <div class="form-group">
          <label for="firstNameInput">Фамилия:</label>
          <input type="text" class="form-control" id="firstNameInput" v-model="firstName" v-if="isEditModeOn">
          <div class="form-control" v-if="!isEditModeOn">{{ GET_ALL_USER_INFO.firstName }}</div>

          <div class="error-message" v-if="isFirstNameWrong || isFirstNameNull">
            {{ isFirstNameWrong ? "Допускаются только буквы" :
              isFirstNameNull ? "Поле обязательно для заполнения" : ""}}</div>
        </div>
        <div class="form-group">
          <label for="surnameInput">Имя:</label>
          <input type="text" class="form-control" id="surnameInput" v-model="surname" v-if="isEditModeOn">
          <div class="form-control" v-if="!isEditModeOn">{{ GET_ALL_USER_INFO.surname }}</div>

          <div class="error-message" v-if="isSurnameWrong || isSurnameNull">
            {{ isSurnameWrong ? "Допускаются только буквы" :
              isSurnameNull ? "Поле обязательно для заполнения" : ""}}</div>
        </div>
        <div class="form-group">
          <label for="middleNameInput">Отчество:</label>
          <input type="text" class="form-control" id="middleNameInput" v-model="middleName" v-if="isEditModeOn">
          <div class="form-control" v-if="!isEditModeOn">{{ GET_ALL_USER_INFO.middleName}}</div>

          <div class="error-message" v-if="isMiddleNameWrong || isMiddleNameNull">
            {{ isMiddleNameWrong ? "Допускаются только буквы" :
              isMiddleNameNull ? "Поле обязательно для заполнения" : ""}}</div>
        </div>
        <div class="form-group">
          <label for="emailRegInput">Email:</label>
          <input type="email" class="form-control" id="emailRegInput" v-model="email" v-if="isEditModeOn" @focusout="validateRegMail(emailRegister)">
          <div class="form-control" v-if="!isEditModeOn">{{ GET_ALL_USER_INFO.email }}</div>

          <div class="error-message" v-if="isEmailRegisterWrong || isEmailRegisterNull">
            {{ isEmailRegisterWrong ? "Проверьте, пожалуйста, введенный адрес электронной почты" :
              isEmailRegisterNull ? "Поле обязательно для заполнения" : ""}}</div>
        </div>
        <div class="form-group">
          <label for="phoneInput">Телефон:</label>
          <input type="text" class="form-control" id="phoneInput" v-model="phone" v-if="isEditModeOn">
          <div class="form-control" v-if="!isEditModeOn">{{ GET_ALL_USER_INFO.phone }}</div>

          <div class="error-message" v-if="isPhoneNumberWrong || isPhoneNumberNull">
            {{ isPhoneNumberWrong ? "Допускаются только цифры" :
              isPhoneNumberNull ? "Поле обязательно для заполнения" : ""}}</div>
        </div>
        <div class="buttons">
          <button class="cards-btn action" @click="editUserData">{{ isEditModeOn ? 'Обновить' : 'Редактировать'}}</button>
          <button class="cards-btn" @click="isEditModeOn=false" v-if="isEditModeOn">{{ 'Отмена' }}</button>
          <button class="cards-btn" @click="deleteUserData" v-show="!isEditModeOn">Удалить аккаунт</button>
        </div>
      </div>
    </div>
    <div class="error-msg-block" v-if="IS_UPDATE_ERROR_DETECTED">{{ GET_ERROR_MESSAGE }}</div>
  </div>
</template>

<script>
import validationMixins from "@/components/mixins/validationMixins.js";
import {mapActions, mapGetters} from "vuex";
export default {
  name: "UserPage",
  mixins: [validationMixins],
  data() {
    return {
      isOwner: false,
      surname: '',
      firstName: '',
      middleName: '',
      email: '',
      phone: '',
      isEditModeOn: false,
    }
  },
  computed: {
    ...mapGetters(['IS_USER_OWNER',
      'GET_ALL_USER_INFO',
      'GET_ERROR_MESSAGE',
      'IS_UPDATE_ERROR_DETECTED',
      'GET_UPDATE_KEY']),
  },
  methods: {
    ...mapActions(['updateUser']),
    updateUserFields(){
      const options = {
        instance: 'user',
        fields: ['surname', 'firstName', 'middleName', 'email', 'phone'],
        values: [this.surname, this.firstName, this.middleName, this.email, this.phone]
      }
      this.$store.commit('updateField', options);
    },
    editUserData() {
      if(this.isEditModeOn){
        const body = {
          "id": +this.$store.getters.GET_ALL_USER_INFO.id,
          "first_name": this.firstName,
          "surname": this.surname,
          "middle_name": this.middleName,
          "email": this.email,
          "phone": this.phone,
          "role_id": +this.$store.getters.GET_ALL_USER_INFO.role_id,
        }
        console.log(body);
        this.$store.dispatch('updateUser', body);
        this.updateUserFields();
      } else {
        this.surname = this.$store.getters.GET_ALL_USER_INFO.surname;
        this.firstName = this.$store.getters.GET_ALL_USER_INFO.firstName;
        this.middleName = this.$store.getters.GET_ALL_USER_INFO.middleName;
        this.email = this.$store.getters.GET_ALL_USER_INFO.email;
        this.phone = +this.$store.getters.GET_ALL_USER_INFO.phone;
      }
      this.isEditModeOn = !this.isEditModeOn;
      this.$store.commit('updateKey');
    },
    deleteUserData(){
      const body = {
        id: +this.$store.getters.GET_ALL_USER_INFO.id,
      };

      console.log(body);
      this.$store.dispatch('deleteUser', body);
    }
  },
  mounted() {
    const options = {
      typeError: 'isUpdateErrorDetected',
      boolean: false
    }
    this.$store.commit('detectError', options);
  }
}
</script>

<style scoped>
  .profile {
    display: grid;
    grid-template-columns: 28% 65% 1%;
    column-gap: 30px;
    width: 90%;
  }

  .profile-photo img {
    max-width: 100%;
  }

  .form-group {
    display: grid;
    grid-template-columns: 1.5fr 3.3fr;
    gap: 0.6em;
  }

  .form-group label {
    font-weight: 800;
  }

  .form-group > div {
    text-align: left;
  }

  .error-msg-block {
    width: 100%;
    text-align: center;
    color: darkred;
    font-size: 26px;
  }
  .buttons {
    display: flex;
    flex-direction: row;
    gap: 1em;
  }

  .buttons > .cards-btn {
    width: 47%;
  }

  label {
    margin: 0;
  }

  .form-group > label {
    display: flex;
    justify-content: flex-start;
  }

  .form-group > .form-control {
    display: flex;
    align-items: center;
  }

  @media (max-width: 597px) {

    .buttons {
      width: 100%;
      flex-direction: column;
    }

    .buttons > .cards-btn {
      width: 100%;
    }
  }

</style>
