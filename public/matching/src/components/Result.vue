<template>
  <section class="section">
    <p>{{ groupSize }}</p>
    <p>{{ numGroups }}</p>
    <div id="contents" class="columns">
      <div class="column" v-for="group in groups" :key="group.id">
        <div class="box">
          <h2 class="is-size-4">Group{{ group.id }}</h2>
          <ul>
            <li v-for="participant in group.participants" :key="participant.id">
              {{ participant.name }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { Participant, Group } from '../entity'

@Component
export default class Result extends Vue {
  readonly store = this.$store;

  get groups(): Group[] {
    return this.store.getters.groups;
  }

  // n user per group
  get groupSize(): number {
    return this.store.getters.groupSize;
  }
}
</script>
<style>
</style>