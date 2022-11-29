<template>
    <section class="my-5 grid grid-cols-3 grid-rows-2 gap-2">
        <HalftimeInput />
        <VideoPlayer />
        <Players />
    </section>
    
</template>

<script setup lang="ts">
import EditorHeaderHalftime from '@/components/editor/EditorHeaderHalftime.vue';
import HalftimeInput from '@/components/replayEditor/HalftimeInput.vue';
import Players from '@/components/replayEditor/Players.vue';
import VideoPlayer from '@/components/replayEditor/VideoPlayer.vue';
import { useFootballStore } from '@/stores/footballStore';
import { onMounted } from 'vue';



const store = useFootballStore();
store.current_editor = 1;
onMounted(() => {
    store.checkLocalStorage('gamesReplay');
})
</script>

<style scoped>

section {
    grid-template-columns: 0.3fr 1fr 0.2fr;
}

</style>