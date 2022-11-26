<template>
    <div @click="store.toggleClock()" class="flex flex-row text-5xl font-zector font-extrabold cursor-pointer active:text-slate-600">
        <div>{{ min }}</div>
        <div>:</div>
        <div>{{ sec }}</div>
    </div>
</template>

<script setup lang="ts">
import { timeAgo } from '@/plugins/timeAgo';
import { useFootballStore } from '@/stores/footballStore';
import { ref, watch } from 'vue';

const min = ref("00");
const sec = ref("00");

function format(m: number): string {
    let s = `${m}`;
    if (s.length == 1) {
        s = `0${m}`;
    }
    return s;
}



const store = useFootballStore();
const ms = ref(store.$state.editors[store.editor()].currentClock);

watch(store.$state, async (old, newer) => {
    if (newer.editors[store.editor()].currentClock.running == true) {
        let ta = timeAgo(newer.editors[store.editor()].currentClock.ms, false);
        min.value = format(ta.minutes);
        sec.value = format(ta.seconds);
    }

})

</script>