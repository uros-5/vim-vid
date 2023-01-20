<template lang="pug">
section(class="my-5 grid grid-cols-3 grid-rows-3 lg:grid-cols-3 lg:grid-rows-2 gap-5 lg:gap-3")
  VideoPlayer
  Players
  HalftimeInput 
</template>

<script setup lang="ts">
import HalftimeInput from "@/components/replayEditor/HalftimeInput.vue";
import Players from "@/components/replayEditor/Players.vue";
import VideoPlayer from "@/components/replayEditor/VideoPlayer.vue";
import { useFootballStore } from "@/stores/footballStore";
import { onMounted } from "vue";

const store = useFootballStore();
onMounted(() => {
  store.current_editor = 1;
  store.checkLocalStorage("gamesReplay");
});
</script>

<style scoped>
section {
  grid-template-rows: 1fr 0.3fr 0.3fr;
}

@media (min-width: 1024px) {
  section {
    grid-template-columns: 0.3fr 1fr 0.2fr;
    grid-template-rows: auto;
  }
}
</style>
