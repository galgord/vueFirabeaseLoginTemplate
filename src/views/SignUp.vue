<template>
  <v-card class="mx-auto" style="max-width: 500px">
    <v-overlay :value="isLoading">
      <v-progress-circular
        color="primary"
        indeterminate
        size="64"
      ></v-progress-circular>
    </v-overlay>
    <v-form ref="form" v-model="form" class="pa-4 mt-6">
      <v-text-field
        v-model="name"
        :rules="[rules.required]"
        filled
        label="Name"
      ></v-text-field>
      <v-text-field
        v-model="email"
        :rules="[rules.email]"
        filled
        label="Email"
        type="email"
      ></v-text-field>
      <v-text-field
        v-model="password"
        :rules="[rules.password, rules.length(6)]"
        filled
        counter="6"
        label="Password"
        type="password"
        style="min-height: 96px"
      ></v-text-field>
    </v-form>
    <v-alert v-if="errorMsg" border="top" color="red" class="ml-5 mr-5">
      {{ errorMsg }}
    </v-alert>
    <v-divider></v-divider>
    <v-card-actions>
      <v-btn type="text" @click="$refs.form.reset()"> Clear </v-btn>
      <v-spacer></v-spacer>
      <v-btn
        :disabled="!form"
        color="primary"
        :loading="isLoading"
        depressed
        @click="signUpWithEmailAndPassword"
      >
        Sign Up
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
import { mapActions } from "vuex";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { collection, setDoc, doc } from "firebase/firestore";
import { db } from "../main";
export default {
  data: () => {
    return {
      name: "",
      email: "",
      password: "",
      errorMsg: "",
      form: false,
      isLoading: false,
      rules: {
        email: (v) => !!(v || "").match(/@/) || "Please enter a valid email",
        length: (len) => (v) =>
          (v || "").length >= len ||
          `Invalid character length, requires ${len}`,
        password: (v) =>
          !!(v || "").match(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(_|[^\w])).+$/
          ) ||
          "Password must container upper case, lower case, number, and a special character",
        required: (v) => !!v || "This Field is required.",
      },
    };
  },
  methods: {
    ...mapActions({
      setUserData: "user/setUserData",
    }),
    async signUpWithEmailAndPassword() {
      this.isLoading = true;
      try {
        const auth = getAuth();
        let authRes = await createUserWithEmailAndPassword(
          auth,
          this.email,
          this.password
        );
        const usersRef = collection(db, "users");
        await setDoc(doc(usersRef, authRes.user.uid), {
          name: this.name,
          email: this.email,
        });
        this.setUserData({
          id: authRes.user.uid,
          name: this.name,
          email: this.email,
        });
        this.$router.replace({ name: "Home" });
      } catch (err) {
        this.errorMsg = "An unexpected Error has occured!";
        if (err.code) {
          this.errorMsg = err.code;
        }
      }
      this.isLoading = false;
    },
  },
};
</script>
