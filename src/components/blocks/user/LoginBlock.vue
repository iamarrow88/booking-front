<template>
  <div class="login-block">
    <div v-if="GET_ERROR_MESSAGE" class="error-message">
      {{ GET_ERROR_MESSAGE }}
    </div>
    <div v-if="!IS_LOGGED_IN">
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
      <button class="btn btn-primary cards-btn"
              @click="login">Войти в аккаунт
      </button>

      <button @click="this.$emit('entryBlockToggle', false)"
              class="sub-btn">Зарегистрироваться
      </button>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import validationMixins from "@/components/mixins/validationMixins.js";
import paths from "@/data-and-functions/constants/paths.js";


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
        if (this.IS_LOGGED_IN) {
          if(this.$route.query.toPayment === 'true'){
            this.$router.push({
              path: paths.PaymentPage,
            });
          } else {
            this.$router.push({
              path: paths.UserPage,
              params: {id: this.$store.state.authorization.user.id}
            });
          }
        }
        /*if (this.$store.getters.IS_LOGGED_IN) this.$router.push({
          path: paths.UserPage,
          params: {id: this.$store.state.authorization.user.id}
        });*/
      }
    },

  }

}
</script>

<style scoped>

</style>
