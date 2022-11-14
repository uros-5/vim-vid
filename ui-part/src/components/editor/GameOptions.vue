<template>
    <div class="row-start-4 col-span-3 grid grid-cols-3 gap-3 grid-rows-2 text-lg font-lekton"
        :class="{ 'row-start-5': store.isZen() }">
        <button @click="store.zenMode()"
            class="bg-slate-500 shadow shadow-slate-500 rounded-lg row-start-1 col-start-1">Zen</button>
        <button @click="store.startWith()"
            class="bg-slate-500 shadow shadow-slate-500 rounded-lg row-start-1 col-start-2">Start with</button>
        <button @click="store.startHalftime()"
            class="bg-slate-500 shadow shadow-slate-500 rounded-lg row-start-1 col-start-3">Start halftime</button>
        <button @click="store.enableModal(0)"
            class="bg-slate-500 shadow shadow-slate-500 rounded-lg row-start-2 col-start-1">Change clock</button>
        <button @click="store.startClock()"
            class="bg-slate-500 shadow shadow-slate-500 rounded-lg row-start-2 col-start-2">Start clock</button>
        <button @click="store.pauseClock()"
            class="bg-slate-500 shadow shadow-slate-500 rounded-lg row-start-2 col-start-3">Stop clock</button>
    </div>


</template>

<script setup lang="ts">
import { useFootballStore } from '@/stores/footballStore';


const store = useFootballStore();

</script>