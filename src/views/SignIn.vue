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
        v-model="email"
        :rules="[rules.required]"
        filled
        label="Email"
        type="email"
      ></v-text-field>
      <v-text-field
        v-model="password"
        :rules="[rules.required]"
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
        @click="signInWithEmailAndPassword"
      >
        Sign In
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
import { mapActions } from "vuex";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../main";
export default {
  data: () => {
    return {
      email: "",
      password: "",
      errorMsg: "",
      form: false,
      isLoading: false,
      rules: {
        required: (v) => !!v || "This Field is required.",
      },
    };
  },
  methods: {
    ...mapActions({
      setUserData: "user/setUserData",
    }),
    async signInWithEmailAndPassword() {
      this.isLoading = true;
      try {
        const auth = getAuth();
        const authRes = await signInWithEmailAndPassword(
          auth,
          this.email,
          this.password
        );
        const docRef = doc(db, "users", authRes.user.uid);
        const dbUser = await getDoc(docRef);
        const userData = dbUser.data();
        this.setUserData({
          id: dbUser.id,
          name: userData.name,
          email: userData.email,
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
