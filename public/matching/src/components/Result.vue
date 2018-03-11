<template>
  <section class="section">
    <p>{{ participants }}</p>
    <p>{{ groupSize }}</p>
    <p>{{ numGroups }}</p>
    <div id="contents">
      <div class="box" v-for="n in numGroups" :key="n">
        <ul>
          <li v-for="participant in groupParticipants(n - 1)" :key="participant">
            {{ participant }}
          </li>
        </ul>
      </div>
    </div>
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

  // n user per group
  get groupSize(): number {
    console.log(this.store.getters.groupSize);
    return this.store.getters.groupSize;
  }
  
  get numGroups(): number {
    return Math.ceil(this.store.getters.participants.length / this.store.getters.groupSize);
  }
  
  groupParticipants(groupId: number): string[] {
    // from: inclusive, to: exclusive
    const from = groupId * this.store.getters.groupSize;
    const to = (groupId + 1) * this.store.getters.groupSize;

    return this.store.getters.participants.slice(from, to);
  }
}
</script>
<style>
</style>