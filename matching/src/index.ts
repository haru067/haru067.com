import Vue from "vue";
import Vuex, { mapGetters, mapActions } from 'vuex'
import store from './store'
import HeaderComponent from "./components/Header.vue";
import BodyComponent from "./components/Body.vue";
import FooterComponent from "./components/Footer.vue";

declare function require(x: string): any; // Suppress warnings
require('./assets/main.scss');

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