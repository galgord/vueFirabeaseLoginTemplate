import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import { initializeApp } from "firebase/app";
import VueCompositionAPI from "@vue/composition-api";
import { getFirestore } from "firebase/firestore";

Vue.config.productionTip = false;

const firebaseConfig = {
  apiKey: "AIzaSyDaAzN0m6BSNWs_zLcAUelEfQ4sMwZWW4w",
  authDomain: "pets-fecf9.firebaseapp.com",
  projectId: "pets-fecf9",
  storageBucket: "pets-fecf9.appspot.com",
  messagingSenderId: "335355341709",
  appId: "1:335355341709:web:0bf7bef9c195d065d7abc4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

new Vue({
  router,
  store,
  vuetify,
  VueCompositionAPI,
  render: (h) => h(App),
}).$mount("#app");
