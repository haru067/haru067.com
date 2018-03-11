<template>
  <section class="section">
    <div id="contents" class="columns">
      <div class="column" v-for="group in displayGroups" :key="group.id">
        <div class="box">
          <h2 class="title is-4">{{ group.name }}</h2>
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
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { Participant, Group } from '../entity'

@Component
export default class Result extends Vue {
  readonly store = this.$store;
  displayGroups: Group[] = []
  timerIds: number[] = [];

  get groups(): Group[] {
    return this.store.getters.groups;
  }

  // n user per group
  get groupSize(): number {
    return this.store.getters.groupSize;
  }

  @Watch("groups")
  onGroupsUpdate(groups: Group[], old: Group[]) {
    this.timerIds.map((id) => clearTimeout(id));
    this.timerIds = [];
    this.displayGroups = [];
    for (const group of groups) {
      const dg = (<any>Object).assign({}, group);
      dg.participants = []; // inserted later with animations
      this.displayGroups.push(dg);
    }

    for (let i = 0; i < groups.length; i++) {
      const dg = this.displayGroups[i];
      for (let j = 0; j < groups[i].participants.length; j++) {
        const callback = () => {
          dg.participants.push(groups[i].participants[j]);
          this.displayGroups[i] = dg;
        };
        const t = this.store.getters.config.animation.showUpInterval;
        const interval = t * (i * this.groupSize) + t * j;
        this.timerIds.push(setTimeout(callback, interval));
      }
    }
  }

  displayGroupName(group: Group) {
    return group.name
  }

  pendingParticipants(): Participant[] {
    let displaying: Participant[] = [];
    for (const dg of this.displayGroups) displaying.concat(dg.participants);

    let all: Participant[] = [];
    for (const g of this.groups) all.concat(g.participants);

    let pendings: Participant[] = [];
    for (const p of all) {
      let contains = false;
      for (const dp of displaying) {
        if (p.id == dp.id) {
          contains = true;
          break;
        }
      }
      if (contains) {
        pendings.push(p);
      }
    }

    return pendings;
  }
}
</script>
<style scoped>
</style>