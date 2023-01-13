<template>
  <div
    class="row-start-2 col-span-2 lg:row-start-2 lg:col-start-2 lg:col-span-2 text-center font-zector font-extrabold hidden"
    :class="{ 'col-span-4 row-end-5 w-full on-block': store.isZen() }">
    <button @click="store.toggleAction"
      class="text-3xl rounded-full bg-slate-600 shadow shadow-slate-800 text-center p-16" :class="{
  'rounded-none w-full h-[70vh]': store.isZen(),
  'bg-slate-300 text-slate-900': store.isActive(),
}">
      <span>
        {{ t() }}
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { useFootballStore } from "@/stores/footballStore";

const store = useFootballStore();

function t() {
  return store.isActive() == true ? "STOP" : "START";
}
</script>

<style scoped>
.on-block {
  display: block;
}
</style>
