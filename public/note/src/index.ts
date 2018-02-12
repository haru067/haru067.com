import Vue from "vue";
import HeaderComponent from "./components/Header.vue";
import BodyComponent from "./components/Body.vue";
import FooterComponent from "./components/Footer.vue";

declare function require(x: string): any;
require('./assets/main.scss');

let v = new Vue({
    el: "#app",
    template: `
    <div>
        <header-component />
        <body-component />
        <footer-component />
    </div>
    `,
    components: {
        HeaderComponent,
        BodyComponent,
        FooterComponent,
    }
});