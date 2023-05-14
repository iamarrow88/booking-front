<template>
  <div class="registration-block">
    <div v-if="!IS_LOGGED_IN">
      <h3 class="subtitle">Регистрация</h3>
      <div class="form-group">
        <label for="firstNameInput">Фамилия:</label>
        <input type="text" class="form-control" id="firstNameInput" v-model="firstName">
        <div class="error-message" v-if="isFirstNameWrong || isFirstNameNull">
          {{
            isFirstNameWrong ? "Допускаются только буквы" :
                isFirstNameNull ? "Поле обязательно для заполнения" : ""
          }}
        </div>
      </div>
      <div class="form-group">
        <label for="surnameInput">Имя:</label>
        <input type="text" class="form-control" id="surnameInput" v-model="surname">
        <div class="error-message" v-if="isSurnameWrong || isSurnameNull">
          {{
            isSurnameWrong ? "Допускаются только буквы" :
                isSurnameNull ? "Поле обязательно для заполнения" : ""
          }}
        </div>
      </div>
      <div class="form-group">
        <label for="middleNameInput">Отчество:</label>
        <input type="text" class="form-control" id="middleNameInput" v-model="middleName">
        <div class="error-message" v-if="isMiddleNameWrong || isMiddleNameNull">
          {{
            isMiddleNameWrong ? "Допускаются только буквы" :
                isMiddleNameNull ? "Поле обязательно для заполнения" : ""
          }}
        </div>
      </div>
      <div class="form-group">
        <label for="emailRegInput">Email:</label>
        <input type="email" class="form-control" id="emailRegInput" v-model="emailRegister"
               @focusout="validateRegMail(emailRegister)">
        <div class="error-message" v-if="isEmailRegisterWrong || isEmailRegisterNull">
          {{
            isEmailRegisterWrong ? "Проверьте, пожалуйста, введенный адрес электронной почты" :
                isEmailRegisterNull ? "Поле обязательно для заполнения" : ""
          }}
        </div>
      </div>
      <div class="form-group">
        <label for="passwordRegInput">Пароль:</label>
        <input type="password" class="form-control" id="passwordRegInput" v-model="passwordRegister">
        <div class="error-message" v-if="isPasswordRegisterNull">Введите пароль</div>
      </div>
      <div class="form-group">
        <label for="phoneInput">Телефон:</label>
        <input type="text" class="form-control" id="phoneInput" v-model="phone">
        <div class="error-message" v-if="isPhoneNumberWrong || isPhoneNumberNull">
          {{
            isPhoneNumberWrong ? "Допускаются только цифры" :
                isPhoneNumberNull ? "Поле обязательно для заполнения" : ""
          }}
        </div>
      </div>
      <div class="form-group">
        <label for="roleIdInput">Роль:</label>
        <select class="form-control" id="roleIdInput" v-model="roleId">
          <option value="2">User</option>
          <option value="3">Owner</option>
        </select>
      </div>
      <div class="buttons">
        <button class="btn btn-primary cards-btn" @click="register">Зарегистрироваться</button>
        <button @click="this.$emit('entryBlockToggle', true)"
                class="sub-btn">У меня уже есть аккаунт
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import validationMixins from "@/components/mixins/validationMixins.js";
import paths from "@/data-and-functions/constants/paths";


export default {
  name: "RegistrationBlock",
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
    ...mapGetters(['IS_LOGGED_IN'])
  },
  mixins: [validationMixins],
  methods: {
    ...mapActions(['registerUser']),
    async register() {
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
      if (this.$store.getters.IS_LOGGED_IN) this.$router.push({
        path: paths.UserPage,
        params: {id: this.$store.state.authorization.user.id}
      });
    },
  }
}
</script>

<style scoped>

.buttons {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 15px
}

button {
  width: 50%;
  margin: 0 auto;
}

</style>
