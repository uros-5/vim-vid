<template lang="pug">
div(class="row-start-1 row-end-1 col-span-3 lg:row-start-2 lg:row-end-2 lg:col-span-1 flex flex-row justify-between lg:flex-col lg:gap-5 lg:items-center")
  EditorHeaderDownload
  EditorHeaderClock 
  EditorHeaderHalftime(v-if="store.isZen() == false")
</template>

<script setup lang="ts">
import { useFootballStore } from "@/stores/footballStore";
import EditorHeaderClock from "./EditorHeaderClock.vue";
import EditorHeaderDownload from "./EditorHeaderDownload.vue";
import EditorHeaderHalftime from "./EditorHeaderHalftime.vue";

const store = useFootballStore();
</script>

<style>

</style>
