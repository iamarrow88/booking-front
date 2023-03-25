<template>
  <div class="container">
    <h1 class="title">Вход/Регистрация</h1>
    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
    <div v-if="!isLoggedIn">
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
        <input type="password" class="form-control" id="passwordLogInput" v-model="passwordLogin" @focusout="checkLoginPass(passwordLogin)">
        <div class="error-message" v-if="isPasswordLoginNull">Введите пароль</div>
      </div>
      <button class="btn btn-primary" @click="login">Login</button>
    </div>

    <div v-if="!isLoggedIn">
      <h3 class="subtitle">Регистрация</h3>
      <div class="form-group">
        <label for="firstNameInput">Фамилия:</label>
        <input type="text" class="form-control" id="firstNameInput" v-model="firstName" @focusout="checkFirstNameInput(firstName)">
        <div class="error-message" v-if="isFirstNameWrong || isFirstNameNull">
          {{ isFirstNameWrong ? "Допускаются только буквы" :
            isFirstNameNull ? "Поле обязательно для заполнения" : ""}}</div>
      </div>
      <div class="form-group">
        <label for="surnameInput">Имя:</label>
        <input type="text" class="form-control" id="surnameInput" v-model="surname" @focusout="checkSurnameInput(surname)">
        <div class="error-message" v-if="isSurnameWrong || isSurnameNull">
          {{ isSurnameWrong ? "Допускаются только буквы" :
            isSurnameNull ? "Поле обязательно для заполнения" : ""}}</div>
      </div>
      <div class="form-group">
        <label for="middleNameInput">Отчество:</label>
        <input type="text" class="form-control" id="middleNameInput" v-model="middleName" @focusout="checkMiddleNameInput(middleName)">
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
        <input type="password" class="form-control" id="passwordRegInput" v-model="passwordRegister" @focusout="checkRegPass(passwordRegister)">
        <div class="error-message" v-if="isPasswordRegisterNull">Введите пароль</div>
      </div>
      <div class="form-group">
        <label for="phoneInput">Телефон:</label>
        <input type="text" class="form-control" id="phoneInput" v-model="phone" @focusout="checkPhoneInput(phone)">
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
      <button class="btn btn-primary" @click="register">Register</button>
    </div>
    <div v-else>
      <h3 class="subtitle">Здравствуйте, {{ surname }}</h3>
      <button class="btn btn-primary" @click="logout">Logout</button>
    </div>
  </div>
</template>


<script>

/*import {createRouter as router} from "vue-router";*/

export default {
  props: {
    isLoggedIn: Boolean,
  },
  data() {
    return {
      id: null,
      firstName: '',
      surname: '',
      middleName: '',
      phone: '',
      roleId: 2,
      token: '',
      errorMessage: '',
      emailLogin: '',
      passwordLogin: '',
      emailRegister: '',
      passwordRegister: '',

      isFirstNameWrong: false,
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

      isPasswordLoginNull: false,
      isPasswordRegisterNull: false,

      regexAlpha: /[^a-zA-ZА-яЁё]/gmi,
      regexNumber: /[^0-9]/g,
    }
  },
  methods: {
    async register() {
      this.isPasswordRegisterNull = false;
      if(this.passwordRegister.length > 0){
        try {
          const res = await fetch('/api/user/register', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              first_name: this.firstName,
              surname: this.surname,
              middle_name: this.middleName,
              email: this.emailRegister,
              password: this.passwordRegister,
              phone: this.phone,
              role_id: this.roleId
            })
          });

          if (!res.ok) {
            this.errorMessage = "Invalid data provided, please try again";
            this.$emit('loggin', false);
          } else {
            const data = await res.json();
            this.token = data.token;
            this.surname = data.surname;
            localStorage.setItem('token', this.token);
            localStorage.setItem('surname', this.surname);
            localStorage.setItem('role_id', this.roleId);
            localStorage.setItem('userId', this.id);
            this.$emit('loggin', true);
            this.errorMessage = '';
            this.$router.push({path: '/mybooking', params: {id: this.id}});

          }
        } catch (err) {
          console.error(err);
        }
      } else {
        this.isPasswordRegisterNull = true;
      }

    },

    async login() {
      this.isPasswordLoginNull = false;

      if(this.passwordLogin.length > 0){
        try {
          const res = await fetch('/api/user/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              email: this.emailLogin,
              password: this.passwordLogin
            })
          });
          if (!res.ok) {
            this.errorMessage = "Invalid data provided, please try again";
            this.$emit('loggin', false);
          } else {
            const data = await res.json();
            this.token = data.token;
            this.surname = data.surname;
            this.roleId = data.role_id;
            this.id = data.id;
            localStorage.setItem('token', this.token);
            localStorage.setItem('surname', this.surname);
            localStorage.setItem('role_id', this.roleId);
            localStorage.setItem('userId', this.id);
            this.$emit('loggin', true);
            this.errorMessage = '';
            //  this.$router.go();

            this.$router.push({path: '/mybooking', params: {id: this.id}});
          }
        } catch (err) {
          console.error(err);
        }
      } else {
        this.isPasswordLoginNull = true;
      }
    },

    async logout() {
      this.$emit('loggin', false);
      this.surname = null
      localStorage.removeItem("token");
      localStorage.setItem('surname', this.surname);
      localStorage.setItem('role_id', this.roleId);
      this.$router.push({path: '/mybooking'});
    },

    validateRegMail(mail){
      this.checkMailReg(mail);
      if(!this.isEmailRegisterNull) this.isEmailRegisterWrong = this.isMailInvalid(mail);
    },

    validateLoginMail(mail){
      this.checkMailLog(mail);
      if(!this.isEmailLoginNull) this.isEmailLoginWrong = this.isMailInvalid(mail);
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
    },

    checkRegPass(pass){
      this.isPasswordRegisterNull = pass.length === 0;
    },

    checkFirstNameInput(val){
      this.isFirstNameNull = val.length === 0;
    },

    checkSurnameInput(val){
      this.isSurnameNull = val.length === 0;
    },

    checkMiddleNameInput(val){
      this.isMiddleNameNull = val.length === 0;
    },

    checkMailLog(val){
      this.isEmailLoginNull = val.length === 0;
    },

    checkMailReg(val){
      this.isEmailRegisterNull = val.length === 0;
    },

    checkPhoneInput(val){
      this.isPhoneNumberNull = val.length === 0;
    },
  },
  watch: {
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
  }
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