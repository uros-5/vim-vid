<template>

  <main class="grid grid-cols-[0.2fr_1fr_0.2fr] grid-rows-[8] gap-3 lg:grid-cols-[repeat(4,_0.5fr),0.7fr] lg:grid-rows-4">
    <VideoPlayer />
    <CurrentCommand />
    <CurrentAction />
    <SmallVideoPlayer />
    <StatusBar />
  </main>

</template>

<script setup lang="ts">
import CurrentAction from '@/components/editor/CurrentAction.vue';
import CurrentCommand from '@/components/editor/CurrentCommand.vue';
import VideoPlayer from '@/components/editor/VideoPlayer.vue';
import SmallVideoPlayer from '@/components/editor/SmallVideoPlayer.vue';
import StatusBar from '@/components/editor/StatusBar.vue';

// <main class="grid grid-cols-3 grid-rows-[8] gap-3 lg:grid-cols-5 lg:grid-rows-4">

</script>

<style scoped>

.editor-view {
  
}


</style>
