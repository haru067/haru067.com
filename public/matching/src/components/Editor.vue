<template>
  <section class="selection">
    <textarea class="textarea" />
    <button class="button is-link">Start</button>
    <input class="input" type="number" name="number" value="4" min="2" max="4">
  </section>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class Editor extends Vue {
    get hasLogin(): boolean {
        return this.$store.getters.user ? true : false;
    }
}
</script>
<style>
</style>