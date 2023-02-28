<template>
  <div>
    <h1>User Login/Registration</h1>
    <div v-if="errorMessage">
      <p>{{ errorMessage }}</p>
    </div>
    <div v-if="!isLoggedIn">
      <h3>Login</h3>
      <div class="form-group">
        <label for="emailInput">Email:</label>
        <input type="email" class="form-control" id="emailInput" v-model="email">
      </div>
      <div class="form-group">
        <label for="passwordInput">Password:</label>
        <input type="password" class="form-control" id="passwordInput" v-model="password">
      </div>
      <button class="btn btn-primary" @click="login">Login</button>
    </div>

    <div v-if="!isLoggedIn">
      <h3>Registration</h3>
      <div class="form-group">
        <label for="firstNameInput">First Name:</label>
        <input type="text" class="form-control" id="firstNameInput" v-model="firstName">
      </div>
      <div class="form-group">
        <label for="surnameInput">Surname:</label>
        <input type="text" class="form-control" id="surnameInput" v-model="surname">
      </div>
      <div class="form-group">
        <label for="middleNameInput">Middle Name:</label>
        <input type="text" class="form-control" id="middleNameInput" v-model="middleName">
      </div>
      <div class="form-group">
        <label for="emailInput">Email:</label>
        <input type="email" class="form-control" id="emailInput" v-model="email">
      </div>
      <div class="form-group">
        <label for="passwordInput">Password:</label>
        <input type="password" class="form-control" id="passwordInput" v-model="password">
      </div>
      <div class="form-group">
        <label for="phoneInput">Phone:</label>
        <input type="text" class="form-control" id="phoneInput" v-model="phone">
      </div>
      <div class="form-group">
        <label for="roleIdInput">Role ID:</label>
        <select class="form-control" id="roleIdInput" v-model="roleId">
          <option value="2">User</option>
          <option value="3">Owner</option>
        </select>
      </div>
      <button class="btn btn-primary" @click="register">Register</button>
    </div>
    <div v-else>
      <h3>Welcome, {{ surname }}</h3>
      <button class="btn btn-primary" @click="logout">Logout</button>
    </div>
  </div>
</template>

<script>

import {createRouter as router} from "vue-router";

export default {
  data() {
    return {
      firstName: '',
      surname: '',
      middleName: '',
      email: '',
      password: '',
      phone: '',
      roleId: 2,
      token: '',
      isLoggedIn: false,
      errorMessage: ''
    }
  },
  methods: {
    async register() {
      try {
        const res = await fetch('/api/user/register', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            first_name: this.firstName,
            surname: this.surname,
            middle_name: this.middleName,
            email: this.email,
            password: this.password,
            phone: this.phone,
            role_id: this.roleId
          })
        });

        if (!res.ok) {
          this.errorMessage = "Invalid data provided, please try again";
        } else {
          const data = await res.json();
          this.token = data.token;
          this.surname = data.surname;
          localStorage.setItem('token', this.token);
          this.isLoggedIn = true;
          this.errorMessage = '';
          router.push('/');
        }
      } catch (err) {
        console.error(err);
      }
    },

    async login() {
      try {
        const res = await fetch('/api/user/login', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            email: this.email,
            password: this.password
          })
        });
        if (!res.ok) {
          this.errorMessage = "Invalid data provided, please try again";
        } else {
          const data = await res.json();
          this.token = data.token;
          this.surname = data.surname;
          localStorage.setItem('token', this.token);
          this.isLoggedIn = true;
          this.errorMessage = '';

          router.push('/');
        }
      } catch (err) {
        console.error(err);
      }
    },

    async logout() {
      this.isLoggedIn = false
      this.surname = null
      localStorage.removeItem("token");
    }
  }
}
</script>