import Vue from "vue";
import Vuex, { mapGetters, mapActions} from 'vuex'
import * as firebase from "firebase";
import store from './store'
import HeaderComponent from "./components/Header.vue";
import BodyComponent from "./components/Body.vue";
import FooterComponent from "./components/Footer.vue";

declare function require(x: string): any; // Suppress warnings
require('./assets/main.scss');

/* Init firebase */
const config = {
    apiKey: "AIzaSyCJbrYXFdEpJSioeSWN4jj_RUK2DN7I1HE",
    authDomain: "haru067-a007c.firebaseapp.com",
    databaseURL: "https://haru067-a007c.firebaseio.com",
    projectId: "haru067-a007c",
    storageBucket: "haru067-a007c.appspot.com",
    messagingSenderId: "609078457943"
};
firebase.initializeApp(config);
firebase.auth().onAuthStateChanged(user => store.commit('updateUser', user));

const v = new Vue({
    el: "#app",
    store,
    template: `
    <div>
        <header-component />
        <body-component />
        <footer-component />
    </div>
    `,
    computed: mapGetters([]),
    methods: mapActions([
        'updatedUser',
    ]),
    components: {
        HeaderComponent,
        BodyComponent,
        FooterComponent,
    }
});