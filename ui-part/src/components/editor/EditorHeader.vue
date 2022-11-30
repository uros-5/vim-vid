<template>
  <div class="row-start-1 row-end-1 col-span-3 flex flex-row justify-between">
    <EditorHeaderDownload />
    <EditorHeaderClock />
    <EditorHeaderHalftime v-if="store.isZen() == false" />
  </div>
</template>

<script setup lang="ts">
import { useFootballStore } from "@/stores/footballStore";
import EditorHeaderClock from "./EditorHeaderClock.vue";
import EditorHeaderDownload from "./EditorHeaderDownload.vue";
import EditorHeaderHalftime from "./EditorHeaderHalftime.vue";

const store = useFootballStore();
</script>

<style></style>
