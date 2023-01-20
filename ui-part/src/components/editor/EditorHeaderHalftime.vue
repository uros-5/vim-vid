<template lang="pug">
div(class="ml-3 grid grid-cols-3 grid-rows-2 gap-3 lg:gap-5 lg:flex lg:justify-between text-2xl lg:text-4xl font-zector"
  :class="{ abc: editor() == 0, 'col-span-1 row-span-1': editor() == 1 }")
  button(@click="store.changeHalftime(1)"
    class="col-start-1 row-start-1 px-2 bg-slate-700 rounded-full lg:px-3 shadow shadow-slate-600"
    :class="{ selected: store.isSelectedHalftime(1) }") 1
  button(@click="store.changeHalftime(2)"
    class="col-start-2 row-start-1 px-2 bg-slate-700 rounded-full lg:px-3 shadow shadow-slate-600"
    :class="{ selected: store.isSelectedHalftime(2) }") 2
  button(@click="store.changeHalftime(3)"
    class="col-start-3 row-start-1 px-2 bg-slate-700 rounded-full lg:px-3 shadow shadow-slate-600"
    :class="{ selected: store.isSelectedHalftime(3) }") 3
  button(@click="store.changeHalftime(4)"
    class="col-start-2 row-start-2 px-2 bg-slate-700 rounded-full lg:px-3 shadow shadow-slate-600"
    :class="{ selected: store.isSelectedHalftime(4) }") 4
  button(@click="store.changeHalftime(5)"
    class="col-start-3 row-start-2 px-2 bg-slate-700 rounded-full lg:px-3 shadow shadow-slate-600"
    :class="{ selected: store.isSelectedHalftime(5) }") 5    
</template>

<script setup lang="ts">
import { useFootballStore } from "@/stores/footballStore";

const store = useFootballStore();

function editor(): number {
  return store.current_editor;
}
</script>

<style scoped>
.selected {
  border: 1px solid white;
}
</style>
