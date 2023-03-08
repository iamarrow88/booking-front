<template>
  <div class="container">
    <h1 class="title">User Login/Registration</h1>
    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
    <div v-if="!isLoggedIn">
      <h3 class="subtitle">Login</h3>
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
      <h3 class="subtitle">Registration</h3>
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
      <h3 class="subtitle">Welcome, {{ surname }}</h3>
      <button class="btn btn-primary" @click="logout">Logout</button>
    </div>
  </div>
</template>


<script>

/*import {createRouter as router} from "vue-router";*/

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
          localStorage.setItem('surname', this.surname);
          localStorage.setItem('role_id', this.roleId);
          this.isLoggedIn = true;
          this.errorMessage = '';
          /*this.$router.go();*/
          /*router.push('/');*/
          this.$router.push('/mybooking');

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
          this.roleId = data.role_id;
          localStorage.setItem('token', this.token);
          localStorage.setItem('surname', this.surname);
          localStorage.setItem('role_id', this.roleId);
          this.isLoggedIn = true;
          this.errorMessage = '';
        //  this.$router.go();

          this.$router.push('/mybooking');
        }
      } catch (err) {
        console.error(err);
      }
    },

    async logout() {
      this.isLoggedIn = false
      this.surname = null
      localStorage.removeItem("token");
      localStorage.setItem('surname', this.surname);
      localStorage.setItem('role_id', this.roleId);
    }
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