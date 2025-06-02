import { createRouter, createWebHistory } from "vue-router";
import LoginPage from "../views/Login.vue";
import Register from "../views/Register.vue";
import AdminPanel from "../views/AdminPanel.vue";
import AddCharger from "../views/AddCharger.vue";
import Home from "../views/Home.vue";
import MainPage from "../views/MainPage.vue"
import UpdatePage from "../views/UpdatePage.vue";

const routes = [
  {
    path: "/",
    name: "Main Page",
    component: MainPage,
  },
  {
    path: "/login",
    name: "Login",
    component: LoginPage,
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
  },
  {
    path: "/adminpanel",
    name: "AdminPanel",
    component: AdminPanel,
  },
  { path: "/adminpanel/add",
    name:"AddCharger",
    component: AddCharger
  },
  { path: "/home",
    name:"Home",
    component: Home
  },
  { path: "/updatepage/:id",
    name:"UpdatePage",
    component: UpdatePage
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
