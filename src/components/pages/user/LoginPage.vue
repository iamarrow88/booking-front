<template>
  <div class="container">
    <h1 class="title">Вход/Регистрация</h1>
    <div v-if="GET_ERROR_MESSAGE" class="error-message">
      {{ GET_ERROR_MESSAGE }}
    </div>
    <div v-if="!IS_LOGGED_IN">
      <h3 class="subtitle">Войти</h3>
      <div class="form-group">
        <label for="emailLogInput">Email:</label>
        <input type="email" class="form-control" id="emailLogInput" v-model="emailLogin" @focusout="validateLoginMail(emailLogin)">
        <div class="error-message" v-if="isEmailLoginWrong || isEmailLoginNull">
          {{ isEmailLoginWrong ? "Проверьте, пожалуйста, введенный адрес электронной почты" :
            isEmailLoginNull ? "Поле обязательно для заполнения" : ""}}</div>
      </div>
      <div class="form-group">
        <label for="passwordLogInput">Пароль:</label>
        <input type="password" class="form-control" id="passwordLogInput" v-model="passwordLogin">
        <div class="error-message" v-if="isPasswordLoginNull">Введите пароль</div>
      </div>
      <button class="btn btn-primary cards-btn" @click="login">Войти в аккаунт</button>
    </div>

    <div v-if="!IS_LOGGED_IN">
      <h3 class="subtitle">Регистрация</h3>
      <div class="form-group">
        <label for="firstNameInput">Фамилия:</label>
        <input type="text" class="form-control" id="firstNameInput" v-model="firstName">
        <div class="error-message" v-if="isFirstNameWrong || isFirstNameNull">
          {{ isFirstNameWrong ? "Допускаются только буквы" :
            isFirstNameNull ? "Поле обязательно для заполнения" : ""}}</div>
      </div>
      <div class="form-group">
        <label for="surnameInput">Имя:</label>
        <input type="text" class="form-control" id="surnameInput" v-model="surname">
        <div class="error-message" v-if="isSurnameWrong || isSurnameNull">
          {{ isSurnameWrong ? "Допускаются только буквы" :
            isSurnameNull ? "Поле обязательно для заполнения" : ""}}</div>
      </div>
      <div class="form-group">
        <label for="middleNameInput">Отчество:</label>
        <input type="text" class="form-control" id="middleNameInput" v-model="middleName">
        <div class="error-message" v-if="isMiddleNameWrong || isMiddleNameNull">
          {{ isMiddleNameWrong ? "Допускаются только буквы" :
            isMiddleNameNull ? "Поле обязательно для заполнения" : ""}}</div>
      </div>
      <div class="form-group">
        <label for="emailRegInput">Email:</label>
        <input type="email" class="form-control" id="emailRegInput" v-model="emailRegister" @focusout="validateRegMail(emailRegister)">
        <div class="error-message" v-if="isEmailRegisterWrong || isEmailRegisterNull">
          {{ isEmailRegisterWrong ? "Проверьте, пожалуйста, введенный адрес электронной почты" :
            isEmailRegisterNull ? "Поле обязательно для заполнения" : ""}}</div>
      </div>
      <div class="form-group">
        <label for="passwordRegInput">Пароль:</label>
        <input type="password" class="form-control" id="passwordRegInput" v-model="passwordRegister" >
        <div class="error-message" v-if="isPasswordRegisterNull">Введите пароль</div>
      </div>
      <div class="form-group">
        <label for="phoneInput">Телефон:</label>
        <input type="text" class="form-control" id="phoneInput" v-model="phone">
        <div class="error-message" v-if="isPhoneNumberWrong || isPhoneNumberNull">
          {{ isPhoneNumberWrong ? "Допускаются только цифры" :
            isPhoneNumberNull ? "Поле обязательно для заполнения" : ""}}</div>
      </div>
      <div class="form-group">
        <label for="roleIdInput">Роль:</label>
        <select class="form-control" id="roleIdInput" v-model="roleId">
          <option value="2">User</option>
          <option value="3">Owner</option>
        </select>
      </div>
      <button class="btn btn-primary cards-btn" @click="register">Зарегистрироваться</button>
    </div>
    <div v-else>
      <h3 class="subtitle">Здравствуйте, {{ surname }}</h3>
      <button class="btn btn-primary cards-btn" @click="logout">Выйти из аккаунта</button>
    </div>
  </div>
</template>


<script>


import validationMixins from "@/components/mixins/validationMixins";
import {mapActions, mapGetters} from "vuex";
import paths from "@/data-and-functions/constants/paths.js";

export default {
  mixins: [validationMixins],
  data() {
    return {
      id: null,
      firstName: '',
      surname: '',
      middleName: '',
      phone: '',
      roleId: 2,
      token: '',
      emailLogin: '',
      passwordLogin: '',
      emailRegister: '',
      passwordRegister: '',
    }
  },
  computed: {
    ...mapGetters(['IS_LOGGED_IN', 'GET_ERROR_MESSAGE']),
  },
  methods: {
    ...mapActions(['registerUser', 'loginUser']),
    async register(){
      this.isPasswordRegisterNull = false;

      const body = {
        first_name: this.firstName,
        surname: this.surname,
        middle_name: this.middleName,
        email: this.emailRegister,
        password: this.passwordRegister,
        phone: this.phone,
        role_id: this.roleId
      }

      this.$store.dispatch('registerUser', body);
      if(this.$store.getters.IS_LOGGED_IN) this.$router.push({ path: paths.UserPage, params: {id: this.$store.state.authorization.user.id}});
    },

    async login() {
      this.isPasswordLoginNull = false;

      const body = {
        email: this.emailLogin,
        password: this.passwordLogin
      }

      if(!this.checkLoginPass(this.passwordLogin) ||
          this.validateLoginMail(this.emailLogin)){
        this.$store.dispatch('loginUser', body);
        if(this.$store.getters.IS_LOGGED_IN) this.$router.push({path: paths.UserPage, params: {id: this.$store.state.authorization.user.id}});
      }
    },

    logout() {
      this.$store.commit('logoutUser');
    },

    /*validateRegMail(mail){
      this.checkMailReg(mail);
      if(this.isEmailRegisterNull) return false;
      if(!this.isEmailRegisterNull) this.isEmailRegisterWrong = this.isMailInvalid(mail);
      return this.isEmailRegisterWrong;
    },

    validateLoginMail(mail){
      this.checkMailLog(mail);
      if(this.isEmailLoginNull) return false;
      if(!this.isEmailLoginNull) this.isEmailLoginWrong = this.isMailInvalid(mail);
      return this.isEmailLoginWrong;
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

    checkLoginPass(pass){
      this.isPasswordLoginNull = pass.length === 0;
      return this.isPasswordLoginNull;
    },

    checkRegPass(pass){
      this.isPasswordRegisterNull = pass.length === 0;
      return this.isPasswordRegisterNull;
    },

    checkFirstNameInput(val){
      this.isFirstNameNull = val.length === 0;
      return this.isFirstNameNull;
    },

    checkSurnameInput(val){
      this.isSurnameNull = val.length === 0;
      return this.isSurnameNull;
    },

    checkMiddleNameInput(val){
      this.isMiddleNameNull = val.length === 0;
      return this.isMiddleNameNull;
    },

    checkMailLog(val){
      this.isEmailLoginNull = val.length === 0;
      return this.isEmailLoginNull;
    },

    checkMailReg(val){
      this.isEmailRegisterNull = val.length === 0;
      return this.isEmailRegisterNull;
    },

    checkPhoneInput(val){
      this.isPhoneNumberNull = val.length === 0;
      return this.isPhoneNumberNull;
    },*/
  },
  /*watch: {
    firstName(newName) {
      this.isFirstNameWrong = newName.match(this.regexAlpha);
      this.isFirstNameNull = false;
    },
    surname(newName) {
      this.isSurnameWrong = newName.match(this.regexAlpha);
      this.isSurnameNull = false;
    },
    middleName(newName) {
      this.isMiddleNameWrong= newName.match(this.regexAlpha);
      this.isMiddleNameNull = false;
    },
    phone(newName) {
      this.isPhoneNumberWrong= newName.match(this.regexNumber);
      this.isPhoneNumberNull = false;
    },
    passwordLogin() {
      this.isPasswordLoginNull = false;
    },
    passwordRegister() {
      this.isPasswordRegisterNull = false;
    },
    emailLogin(){
      this.isEmailLoginNull = false;
    },
    emailRegister(){
      this.isEmailRegisterNull = false;
    }
  }*/
}
</script>

<style>
.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 0 20px;
}

.form-group {
  margin-bottom: 25px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-size: 18px;
}

input[type="text"],
input[type="email"],
input[type="password"],
select {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #d8d8d8;
  transition: border-color 0.2s ease-in-out;
}

input[type="text"]:focus,
input[type="email"]:focus,
input[type="password"]:focus,
select:focus {
  outline: none;
  border-color: #007bff;
}

button {
  display: inline-block;
  padding: 12px 25px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 5px;
  background-color: #007bff;
  color: #fff;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
}

button:hover {
  background-color: #0069d9;
}

.error-message {
  color: #dc3545;
  font-size: 16px;
  margin-top: 10px;
}

.title {
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 20px;
}

.subtitle {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 15px;
}

</style>