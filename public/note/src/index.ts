import Vue from "vue";
import HeaderComponent from "./components/Header.vue";
import HelloComponent from "./components/Hello.vue";

declare function require(x: string): any;
require('./assets/main.scss');

let v = new Vue({
    el: "#app",
    template: `
    <div>
        <header-component />
        Name: <input v-model="name" type="text">
        <hello-component :name="name" :initialEnthusiasm="5" />
    </div>
    `,
    data: { name: "World" },
    components: {
        HelloComponent,
        HeaderComponent
    }
});