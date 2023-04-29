<template>
  <div class="profile">
    <div class="profile-photo">
      <img src="../assets/user.png" v-if="!isOwner" alt="photo">
      <img class="avatar" v-if="isOwner" src="../assets/admin.png" alt="avatar">

      <p>{{ surname }}</p>
    </div>
    <div class="user-data">
      <div class="form-group">
        <label for="firstNameInput">Фамилия:</label>
        <input type="text" class="form-control" id="firstNameInput" v-model="firstName" v-if="isEditModeOn">
        <div class="form-control" v-if="!isEditModeOn">{{firstName}}</div>

        <div class="error-message" v-if="isFirstNameWrong || isFirstNameNull">
          {{ isFirstNameWrong ? "Допускаются только буквы" :
            isFirstNameNull ? "Поле обязательно для заполнения" : ""}}</div>
      </div>
      <div class="form-group">
        <label for="surnameInput">Имя:</label>
        <input type="text" class="form-control" id="surnameInput" v-model="surname" v-if="isEditModeOn">
        <div class="form-control" v-if="!isEditModeOn">{{surname}}</div>

        <div class="error-message" v-if="isSurnameWrong || isSurnameNull">
          {{ isSurnameWrong ? "Допускаются только буквы" :
            isSurnameNull ? "Поле обязательно для заполнения" : ""}}</div>
      </div>
      <div class="form-group">
        <label for="middleNameInput">Отчество:</label>
        <input type="text" class="form-control" id="middleNameInput" v-model="middleName" v-if="isEditModeOn">
        <div class="form-control" v-if="!isEditModeOn">{{middleName}}</div>

        <div class="error-message" v-if="isMiddleNameWrong || isMiddleNameNull">
          {{ isMiddleNameWrong ? "Допускаются только буквы" :
            isMiddleNameNull ? "Поле обязательно для заполнения" : ""}}</div>
      </div>
      <div class="form-group">
        <label for="emailRegInput">Email:</label>
        <input type="email" class="form-control" id="emailRegInput" v-model="emailRegister" v-if="isEditModeOn" @focusout="validateRegMail(emailRegister)">
        <div class="form-control" v-if="!isEditModeOn">{{emailRegister}}</div>

        <div class="error-message" v-if="isEmailRegisterWrong || isEmailRegisterNull">
          {{ isEmailRegisterWrong ? "Проверьте, пожалуйста, введенный адрес электронной почты" :
            isEmailRegisterNull ? "Поле обязательно для заполнения" : ""}}</div>
      </div>
      <div class="form-group">
        <label for="phoneInput">Телефон:</label>
        <input type="text" class="form-control" id="phoneInput" v-model="phone" v-if="isEditModeOn">
        <div class="form-control" v-if="!isEditModeOn">{{phone}}</div>

        <div class="error-message" v-if="isPhoneNumberWrong || isPhoneNumberNull">
          {{ isPhoneNumberWrong ? "Допускаются только цифры" :
            isPhoneNumberNull ? "Поле обязательно для заполнения" : ""}}</div>
      </div>
      <button class="cards-btn" @click="editUserData">{{ isEditModeOn ? 'Обновить' : 'Редактировать'}}</button>
    </div>
  </div>
</template>

<script>
import validationMixins from "@/components/mixins/validationMixins";
export default {
  name: "UserProfile",
  mixins: [validationMixins],
  props: {
    isOwnerParent: Boolean,
    surnameParent: String,
    firstNameParent: String,
    middleNameParent: String,
    emailRegisterParent: String,
    phoneParent: String,
  },
  data() {
    return {
      isOwner: false,
      surname: '',
      firstName: '',
      middleName: '',
      emailRegister: '',
      phone: '',
      isEditModeOn: false,
      /*isFirstNameWrong: false,
      isEmailLoginWrong: false,
      isSurnameWrong: false,
      isMiddleNameWrong: false,
      isEmailRegisterWrong: false,
      isPhoneNumberWrong: false,

      isFirstNameNull: false,
      isEmailLoginNull: false,
      isSurnameNull: false,
      isMiddleNameNull: false,
      isEmailRegisterNull: false,
      isPhoneNumberNull: false,

      regexAlpha: /[^a-zA-ZА-яЁё]/gmi,
      regexNumber: /[^0-9]/g,*/
    }
  },
  methods: {
    editUserData() {
      if(this.isEditModeOn){
        console.log('отредактировали');
      } else {
        console.log('ща как отредактируем!');
      }
      this.isEditModeOn = !this.isEditModeOn;
    }
    /*validateRegMail(mail){
      this.checkMailReg(mail);
      if(this.isEmailRegisterNull) return false;
      if(!this.isEmailRegisterNull) this.isEmailRegisterWrong = this.isMailInvalid(mail);
      return this.isEmailRegisterWrong;
    },
    isMailInvalid(mail){
      if(mail.match(/[\s]/g)) return true;
      const dogHunter = mail.split('@');
      if(dogHunter.length !== 2) return true;
      const dotHunter = dogHunter[1].split('.');
      if(dotHunter.length >= 2) {
        return !!dotHunter.some(el => el == false);
      } else {
        return true;
      }
    },
    checkMailReg(val){
      this.isEmailRegisterNull = val.length === 0;
      return this.isEmailRegisterNull;
    },*/

  },
  watch: {
    /*firstName(newName) {
      this.isFirstNameWrong = newName.match(this.regexAlpha);
      this.isFirstNameNull = false;
    },
    surname(newName) {
      this.isSurnameWrong = newName.match(this.regexAlpha);
      this.isSurnameNull = false;
    },
    middleName(newName) {
      this.isMiddleNameWrong = newName.match(this.regexAlpha);
      this.isMiddleNameNull = false;
    },
    phone(newName) {
      this.isPhoneNumberWrong = newName.match(this.regexNumber);
      this.isPhoneNumberNull = false;
    },
    emailRegister(){
      this.isEmailRegisterNull = false;
    }*/
  },
  created() {
    if(localStorage.getItem('firstName').length === 0) {
      console.log(localStorage.getItem('firstName').length);
    }
    this.isOwner = this.isOwnerParent;
    this.surname = this.surnameParent;
    this.firstName = this.firstNameParent;
    this.middleName = this.middleNameParent;
    this.emailRegister = this.emailRegisterParent;
    this.phone = this.phoneParent;
  }

  /*
  * ID         int64  `json:"id"`
	FirstName  string `json:"first_name"`
	Surname    string `json:"surname"`
	MiddleName string `json:"middle_name"`
	Email      string `json:"email" validate:"email,required"`
	Password   string `json:"password" validate:"required"`
	Phone      string `json:"phone" validate:"required"`
	RoleID     int64  `json:"role_id" validate:"required"`
	Token      string `json:"token"`*/
}
</script>

<style scoped>
  .profile {
    display: grid;
    grid-template-columns: 30% 70%;
    column-gap: 50px;
    width: 90%;
  }

  .profile-photo img {
    max-width: 100%;
  }

  .form-group {
    display: grid;
    grid-template-columns: 20% 80%;
  }

  .form-group label {
    font-weight: 800;
  }

  .form-group > div {
    text-align: left;
  }

</style>