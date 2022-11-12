<template>
    <section class="grid grid-cols-3 grid-rows-4 main-editor gap-y-10 text-2xl">
        <EditorHeader />
        <StartStopButton />
        <MoveHighlightsButtons />
        <HighlightsInput />
        <PlayerTabs/>
        <GameOptions />
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

</script>

<style scoped>

    .main-editor {
        grid-template-rows: 0.1fr 0.6fr 0.2fr 0.2fr;
    }

</style>