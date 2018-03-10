<template>
  <section class="section">
    {{ participants }}
  </section>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class Result extends Vue {
  readonly store = this.$store;

  get participants(): string {
    return this.store.getters.participants.reduce((a: string, b: string) => `${a}\n${b}`, "empty");
  }
}
</script>
<style>
</style>