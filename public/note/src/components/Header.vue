<template>
  <nav class="navbar section" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <h1 class="title">memo067</h1>
    </div>
    <div class="navbar-end">
      <a v-if="!hasLogin" class="navbar-item">ログイン</a>
      <a v-if="!hasLogin" class="navbar-item">新規登録</a>
      <a v-if="hasLogin" class="navbar-item">ログアウト</a>
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