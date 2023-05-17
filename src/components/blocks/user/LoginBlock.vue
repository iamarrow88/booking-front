<template>
  <div class="login">
    <div v-if="GET_ERROR_MESSAGE" class="error-message">
      {{ GET_ERROR_MESSAGE }}
    </div>
    <div v-if="!IS_LOGGED_IN" class="login-block">
      <h3 class="subtitle">Войти</h3>
      <div class="form-group">
        <label for="emailLogInput">Email:</label>
        <input type="email"
               class="form-control"
               id="emailLogInput"
               v-model="emailLogin"
               @focusout="validateLoginMail(emailLogin)">
        <div class="error-message"
             v-if="isEmailLoginWrong || isEmailLoginNull">
          {{
            isEmailLoginWrong ? "Проверьте, пожалуйста, введенный адрес электронной почты" :
                isEmailLoginNull ? "Поле обязательно для заполнения" : ""
          }}
        </div>
      </div>
      <div class="form-group">
        <label for="passwordLogInput">Пароль:</label>
        <input type="password"
               class="form-control"
               id="passwordLogInput"
               v-model="passwordLogin">
        <div class="error-message"
             v-if="isPasswordLoginNull">Введите пароль
        </div>
      </div>
      <div class="buttons">
        <button class="btn cards-btn"
                @click="login">Войти в аккаунт
        </button>

        <button @click="this.$emit('entryBlockToggle', false)"
                class="sub-btn">Зарегистрироваться
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import validationMixins from "@/components/mixins/validationMixins.js";


export default {
  name: "LoginBlock",
  data() {
    return {
      emailLogin: '',
      passwordLogin: '',
    }
  },
  computed: {
    ...mapGetters(['GET_ERROR_MESSAGE', 'IS_LOGGED_IN'])
  },
  mixins: [validationMixins],
  methods: {
    ...mapActions(['loginUser']),
    async login() {
      this.isPasswordLoginNull = false;

      const body = {
        email: this.emailLogin,
        password: this.passwordLogin
      }

      if (!this.checkLoginPass(this.passwordLogin) ||
          this.validateLoginMail(this.emailLogin)) {
        this.$store.dispatch('loginUser', body);
        }

      }
    },
}
</script>

<style scoped>

.login-block {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 30px;
}

.buttons {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 15px
}
button {
  width: 70%;
  margin: 0 auto;
}

</style>
