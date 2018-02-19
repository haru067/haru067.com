<template>
  <nav class="navbar section" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <h1 class="title">memo067</h1>
    </div>
    <div v-if="hasLogin" class="navbar-end">
      <a class="navbar-item">ログアウト</a>
    </div>
    <div v-else class="navbar-end">
      <a class="navbar-item">ログイン</a>
      <a class="navbar-item">新規登録</a>
    </div>
  </nav>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class Header extends Vue {
    get hasLogin(): boolean {
        return this.$store.getters.user ? true : false;
    }
}
</script>
<style>
header {
  background-color: antiquewhite;
}
</style>