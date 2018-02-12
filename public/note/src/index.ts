import Vue from "vue";
import HelloComponent from "./components/Hello.vue";

declare function require(x: string): any;
require('./assets/main.scss');

let v = new Vue({
    el: "#app",
    template: `
    <div>
        <h1 class="title">memoです</h1>
        <a class="button">
  Button
</a>
        Name: <input v-model="name" type="text">
        <hello-component :name="name" :initialEnthusiasm="5" />
    </div>
    `,
    data: { name: "World" },
    components: {
        HelloComponent
    }
});