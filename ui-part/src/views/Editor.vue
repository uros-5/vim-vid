<template>
    <ChangeClockModal v-if="store.isModalActive(0)" />
    <PlayerNameModal v-else-if="store.isModalActive(1)" />
    <section class="grid grid-cols-3 grid-rows-4 main-editor gap-y-10 text-2xl lg:hidden"
        :class="{ 'opacity-8': store.anyModal() }">
        <EditorHeader />
        <StartStopButton />
        <MoveHighlightsButtons v-if="store.isZen() == false" />
        <PlayerTabs v-if="store.isZen() == false" />
        <GameOptions />
        <HighlightsInput v-if="store.isZen() == false" />
    </section>
</template>

<script setup lang="ts">
import EditorHeader from '@/components/editor/EditorHeader.vue';
import StartStopButton from '@/components/editor/StartStopButton.vue';
import MoveHighlightsButtons from '@/components/editor/MoveHighlightsButtons.vue';
import HighlightsInput from '@/components/editor/HighlightsInput.vue';
import GameOptions from '@/components/editor/GameOptions.vue';
import PlayerTabs from '@/components/editor/PlayerTabs.vue';
import ChangeClockModal from "@/components/modals/ChangeClockModal.vue";
import PlayerNameModal from "@/components/modals/PlayerNameModal.vue";
import { onMounted } from 'vue';
import { useFootballStore } from '@/stores/footballStore';

const store = useFootballStore();

onMounted(() => {
    store.checkLocalStorage();

})

</script>

<style scoped>
.main-editor {
    grid-template-rows: 0.1fr 0.6fr 0.2fr 0.2fr;
}

.main-editor-zen {
    grid-template-rows: 0.1fr 0.6.fr 0.2fr;
}
</style>