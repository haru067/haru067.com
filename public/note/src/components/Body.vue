<template>
  <section class="section">
    <div class="hero">
      <div class="hero-body">
        <div class="container">
          <h1 class="title has-text-centered">これが本当に必要だったTODOアプリです。</h1>
          <h2 class="subtitle has-text-centered">
            memo067で、新しいTODO管理を始めましょう。
          </h2>
        </div>
      </div>
    </div>
    <div class="has-text-centered">
      <a class="button is-primary is-large">はじめる</a>
      <a class="button is-large" href="https://yahoo.co.jp/">やめとく</a>
    </div>
  </section>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class Body extends Vue {}
</script>
<style>
</style>