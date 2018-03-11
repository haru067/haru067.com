<template>
  <header class="section">
    <nav class="navbar" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <h1 class="title">{{ title }}</h1>
      </div>
    </nav>
  </header>
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
<style scoped>
header.section {
  padding-bottom: 24px;
}
</style>