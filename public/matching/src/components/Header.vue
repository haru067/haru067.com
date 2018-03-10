<template>
  <nav class="navbar section" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <h1 class="title">Matching</h1>
    </div>
  </nav>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class Header extends Vue {
}
</script>
<style>
header {
  background-color: antiquewhite;
}
</style>