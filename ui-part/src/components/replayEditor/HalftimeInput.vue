<template>
    <div class="my-5 col-span-1 row-start-1 flex flex-col gap-3">
        <EditorHeaderHalftime />
        <div class="my-5 flex gap-4">
            <input v-model="model().min" class="bg-slate-700 rounded text-2xl" type="number" size="3" maxlength="3" />
            <input v-model="model().sec" class="bg-slate-700 rounded text-2xl" type="number" size="3" maxlength="3" />
            <button @click="setHalftime()" class="bg-slate-800 p-3 rounded-sm">SET</button>
        </div>

    </div>


</template>

<script setup lang="ts">
import { timeAgo } from '@/plugins/timeAgo';
import { useFootballStore } from '@/stores/footballStore';
import EditorHeaderHalftime from '../editor/EditorHeaderHalftime.vue';

const store = useFootballStore();

function model(): { min: number, sec: number } {
    const halftime = store.editors[store.editor()].currentHalfTime;
    return store.editors[store.editor()].games[store.selectedPlayer()].match_info.start_halftime[halftime - 1]
}

function setHalftime() {
    const halftime = store.editors[store.editor()].currentHalfTime;
    let time = store.video!.currentTime * 1000;
    let calc = timeAgo(time, true);
    store.editors[store.editor()].games[store.selectedPlayer()].match_info.start_halftime[halftime - 1].min = calc.minutes;
    store.editors[store.editor()].games[store.selectedPlayer()].match_info.start_halftime[halftime - 1].sec = calc.seconds;
    store.saveLocalStorage();
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
input[type=number] {
    -moz-appearance: textfield;
}
</style>