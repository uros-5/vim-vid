<template>
  <div
    class="row-start-4 col-span-3 lg:row-start-2 lg:col-start-4 lg:col-span-1 grid grid-cols-3 gap-3 grid-rows-2 text-lg font-lekton"
    :class="{ 'row-start-5': store.isZen() }">
    <button @click="store.zenMode()"
      class="bg-slate-500 shadow shadow-slate-500 rounded-lg sm:text-2xl md:text-3xl sm:p-5 row-start-1 col-start-1">
      Zen
    </button>
    <button @click="store.startWith()"
      class="bg-slate-500 shadow shadow-slate-500 rounded-lg sm:text-2xl md:text-3xl sm:p-5 row-start-1 col-start-2">
      Start with
    </button>
    <button @click="store.startHalftime()"
      class="bg-slate-500 shadow shadow-slate-500 rounded-lg sm:text-2xl md:text-3xl sm:p-5 row-start-1 col-start-3">
      Start halftime
    </button>
    <button @click="store.enableModal(0)"
      class="bg-slate-500 shadow shadow-slate-500 rounded-lg sm:text-2xl md:text-3xl sm:p-5 row-start-2 col-start-1">
      Change clock
    </button>
    <button @click="store.deletePlayer(store.selectedPlayer())"
      class="bg-slate-500 shadow shadow-slate-500 rounded-lg sm:text-2xl md:text-3xl sm:p-5 row-start-2 col-span-2">
      Delete player
    </button>
  </div>
</template>

<script setup lang="ts">
import { useFootballStore } from "@/stores/footballStore";

const store = useFootballStore();
</script>
