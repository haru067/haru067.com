<template>
  <section class="selection">
    <textarea class="textarea" v-model="participants"/>
    <button class="button is-link" @click="startMatching">Start</button>
    <input class="input" type="number" name="number" v-model="groupSize" min="1" max="4">
  </section>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";

@Component
export default class Editor extends Vue {
  readonly store = this.$store;
  participants: string = "";
  groupSize: string = "4";

  get hasLogin(): boolean {
      return this.$store.getters.user ? true : false;
  }

  @Watch("participants")
  onEditParticipants(v: string, old: string)  {
    const list = v.split("\n");
    this.store.dispatch("updateParticipants", list);
  }

  @Watch("groupSize")
  onEditGroupSize(v: string, old: string)  {
    const groupSize = parseInt(v);
    this.store.dispatch("updateGroupSize", groupSize);
  }

  startMatching() {
    console.log('clicked');
    this.store.dispatch("allocateParticipants");
  }
}
</script>
<style>
</style>