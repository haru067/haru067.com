<template>
  <nav class="navbar section" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <h1 class="title">{{ title }}</h1>
    </div>
  </nav>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class Header extends Vue {
  get title(): string {
    return this.$store.state.config.title || "";
  }
}
</script>
<style>
header {
  background-color: antiquewhite;
}
</style>