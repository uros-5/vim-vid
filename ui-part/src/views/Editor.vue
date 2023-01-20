<template lang="pug">
span
  ChangeClockModal(v-if="store.isModalActive(0)")
  PlayerNameModal(v-else-if="store.isModalActive(1)")
  section(class="grid grid-cols-3 grid-rows-4 lg:grid-rows-3 lg:grid-cols-4 lg:justify-center main-editor gap-y-11 text-2xl lg:gap-2"
  :class="{ 'opacity-8': store.anyModal() }")
    EditorHeader
    StartStopButton
    PlayerTabs(v-if="store.isZen() == false")
    MoveHighlightsButtons(v-if="store.isZen() == false")
    GameOptions
</template>

<script setup lang="ts">
import EditorHeader from "@/components/editor/EditorHeader.vue";
import StartStopButton from "@/components/editor/StartStopButton.vue";
import MoveHighlightsButtons from "@/components/editor/MoveHighlightsButtons.vue";
import GameOptions from "@/components/editor/GameOptions.vue";
import PlayerTabs from "@/components/editor/PlayerTabs.vue";
import ChangeClockModal from "@/components/modals/ChangeClockModal.vue";
import PlayerNameModal from "@/components/modals/PlayerNameModal.vue";
import { onMounted } from "vue";
import { useFootballStore } from "@/stores/footballStore";

const store = useFootballStore();

onMounted(() => {
  store.checkLocalStorage("games");
});
</script>

<style scoped>
.main-editor {
  grid-template-rows: 0.1fr 0.6fr 0.2fr 0.2fr;
}

@media(min-width:1024px) {
  .main-editor {
    grid-template-rows: 0.4fr 1fr 0.4fr;
  }
}

.main-editor-zen {
  grid-template-rows: 0.1fr 0.6.fr 0.2fr;
}
</style>
