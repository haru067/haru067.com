
<template>
  <section class="section root">
    <editor />
    <result />
  </section>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import Editor from "./Editor.vue"
import Result from "./Result.vue"

@Component({
  components: {Editor, Result},
})
export default class Body extends Vue {
}
</script>
<style scoped>
.root {
  padding-top: 16px;
  padding-bottom: 16px;
}
</style>