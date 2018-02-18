<template>
  <section class="section">
    <div class="hero">
      <div class="hero-body">
        <div class="container">
          <h1 class="title has-text-centered">これが本当に必要だったTODOアプリです。</h1>
          <h2 class="subtitle has-text-centered">
            memo067で、新しいTODO管理を始めましょう。
          </h2>
        </div>
      </div>
    </div>
    <div class="has-text-centered">
      <a class="button is-primary is-large" @click="login">はじめる</a>
      <a class="button is-primary is-large" @click="test">test</a>
      <a class="button is-large" href="https://yahoo.co.jp/">やめとく</a>
    </div>
  </section>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import * as firebase from 'firebase'

@Component
export default class Body extends Vue {
  test() {
            console.log('called:');
      this.$store.commit('updateUser', null);
  }
  login() {
    const provider = new firebase.auth.TwitterAuthProvider(); 
    firebase.auth().signInWithRedirect(provider);
    firebase.auth().signInWithCredential
    firebase.auth().getRedirectResult().then((result) => {
      // This gives you a the Twitter OAuth 1.0 Access Token and Secret.
      // You can use these server side with your app's credentials to access the Twitter API.
      var token = result.credential.accessToken;
      var secret = result.credential.secret;
      // The signed-in user info.
      var user = result.user;
      console.log('hoge');
      this.$store.commit('updateUser', user);
    }).catch((error) => {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
      console.log(errorMessage);
    });
  }
}
</script>
<style>
</style>