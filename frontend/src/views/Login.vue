<template>
  <div class="login-container">
    <h2>Login</h2>
    <form @submit.prevent="login">
      <input type="text" v-model="email" placeholder="Email" required />
      <input
        type="password"
        v-model="password"
        placeholder="Password"
        required
      />
      <div>
        <button type="submit">Login</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import "../Styles/Login.css";

const email = ref("");
const password = ref("");
const router = useRouter();

const login = async () => {
  try {
    console.log("Sending login:", email.value, password.value);
    
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    
    const res = await axios.post("https://ev-chargers-befi.onrender.com/api/login", {
      email: email.value,
      password: password.value,
    });
    localStorage.setItem("token", res.data.token);

    const isAdmin = res.data.isAdmin;
    console.log(isAdmin);
    if (isAdmin) {
      router.push("/adminpanel");
    } else {
      router.push("/home");
    }
  } catch (err) {
    alert("Login failed");
  }
};
</script>
