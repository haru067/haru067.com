<template>
  <section class="selection">
    <textarea class="textarea" v-model="participants"/>
    <button class="button is-link" @click="startMatching">Start</button>
    <input class="input" type="number" name="number" value="4" min="2" max="4">
  </section>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";

@Component
export default class Editor extends Vue {
  readonly store = this.$store;
  participants = "";

  get hasLogin(): boolean {
      return this.$store.getters.user ? true : false;
  }

  @Watch("participants")
  onEditParticipants(v: string, old: string)  {
    const list = v.split("\n");
    this.store.dispatch("updateParticipants", list);
  }

  startMatching() {
  }
}
</script>
<style>
</style>