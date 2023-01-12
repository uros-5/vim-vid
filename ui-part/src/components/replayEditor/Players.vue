<template>
  <div class="col-span-3 row-start-2 row-span-1 lg:col-span-1 lg:row-start-2 flex flex-col gap-5 text-2xl">
    <div v-for="i in [1, 2, 3]" :key="i"
      class="bg-slate-500 font-lekton transition-colors duration-200 border-2 border-solid border-black rounded-lg shadow-md shadow-gray-700 hover:gray-300 overflow-hidden"
      :class="{
  'border-gray-300 font-bold font-lekton-bold text-gray-300': store.selectedPlayer() == i - 1,
  'bg-slate-300 text-slate-900': store.isActive(),
}">
      <div class="rounded mx-5 text-2xl lg:text-3xl">{{ i }}. {{ name(i - 1) }}</div>
    </div>
    <EditorHeaderDownload />
  </div>
</template>

<script setup lang="ts">
import { useFootballStore } from "@/stores/footballStore";
import EditorHeaderDownload from "../editor/EditorHeaderDownload.vue";

const store = useFootballStore();

function name(id: number): string {
  let name = store.editors[store.editor()].games[id].match_info.title;
  return name == "" ? `P${id}` : name;
}
</script>
