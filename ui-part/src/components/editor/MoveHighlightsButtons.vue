<template lang="pug">
div(class="col-span-3 lg:row-start-2 lg:col-start-3 lg:col-span-1 font-zector font-bold")
  div(class="flex flex-row lg:flex-col p-2 ml-5 justify-around lg:items-stretch gap-2 lg:gap-5")
    button(@click="store.addActionToOthers(i - 1)" v-for="i in [1, 2, 3]" :key="i"
      class="px-3 py-5 sm:text-2xl md:text-3xl bg-slate-600 hover:bg-slate-500 shadow shadow-slate-600 transition active:bg-red-400 hover:transition-colors rounded-sm")
      span(class="px-1") {{ i }}
  DeleteLastRowButton
</template>

<script setup lang="ts">
import { useFootballStore } from "@/stores/footballStore";
import DeleteLastRowButton from "./DeleteLastRowButton.vue";

const store = useFootballStore();
</script>
