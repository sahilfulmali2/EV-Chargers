<template>
  <div class="container">
    <h1>Welcome to EV Map</h1>
    <h3>Locate your Nearest EV Station</h3>
    <div class="actions">
      <p>Already a user?</p>
      <button @click="goToLogin">Login</button>
    </div>

    <div class="actions">
      <p>New here?</p>
      <button @click="goToRegister">Register</button>
    </div>
  </div>
</template>

<script>
import "../Styles/MainPage.css";

export default {
  methods: {
    goToLogin() {
      this.$router.push('/login');
    },
    goToRegister() {
      this.$router.push('/register');
    }
  }
};
</script>