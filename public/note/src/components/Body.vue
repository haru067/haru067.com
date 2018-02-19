<template>
  <login v-if="!hasLogin" />
  <todo-list v-else />
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import Login from "./Login.vue";
import TodoList from "./TodoList.vue";

@Component({
  components: {Login, TodoList},
})
export default class Body extends Vue {
    get hasLogin(): boolean {
        return this.$store.getters.user ? true : false;
    }
}
</script>
<style>
</style>