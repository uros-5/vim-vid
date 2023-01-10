<template>
  <div class="my-5 col-span-3 row-start-3 lg:col-span-1 lg:row-start-1 flex flex-col items-center gap-3">
    <p class="text-4xl">
     {{ store.editors[store.editor()].currentHalfTime}}
      <span class="text-2xl">{{ halftime() }}</span>
    </p>
    <div class="my-5 flex gap-4">
    
      <input
      disabled
        v-model="model().min"
        class="bg-slate-700 rounded text-2xl"
        type="number"
        size="3"
        maxlength="3"
      />
      <input
      disabled
        v-model="model().sec"
        class="bg-slate-700 rounded text-2xl"
        type="number"
        size="3"
        maxlength="3"
      /> 
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFootballStore } from "@/stores/footballStore";
import EditorHeaderHalftime from "../editor/EditorHeaderHalftime.vue";

const store = useFootballStore();

function model(): { min: number; sec: number } {
  const halftime = store.editors[store.editor()].currentHalfTime;
  return store.editors[store.editor()].games[store.selectedPlayer()].match_info
    .start_halftime[halftime - 1];
}

function halftime(): string {
  const halftime = store.editors[store.editor()].currentHalfTime;
  const halftimes = ['st', 'nd', 'rd', 'th', 'th'];
  return halftimes[halftime - 1];
}

</script>

<style scoped>
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type="number"] {
  --moz-appearance: textfield;
}
</style>
