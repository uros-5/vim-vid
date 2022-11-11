<template>
    <section class="grid grid-cols-3 main-editor">
        <EditorHeader />
        <StartStopButton />
        <MoveHighlightsButtons />
        <HighlightsInput />
        <PlayerTabs/>
    </section>
</template>

<script setup lang="ts">
import EditorHeader from '@/components/editor/EditorHeader.vue';
import StartStopButton from '@/components/editor/StartStopButton.vue';
import MoveHighlightsButtons from '@/components/editor/MoveHighlightsButtons.vue';
import HighlightsInput from '@/components/editor/HighlightsInput.vue';
import PlayerTabs from '@/components/editor/PlayerTabs.vue';

</script>

<style scoped>

    .main-editor {
        grid-template-rows: 0.1fr 0.6fr 0.3fr 0.2fr;
    }

</style>