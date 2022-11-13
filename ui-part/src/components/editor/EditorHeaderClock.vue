<template>
    <div class="flex flex-row text-5xl font-zector font-extrabold">
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
const ms = ref(store.$state.currentClock);

watch(store.$state, async (old, newer) => {
    if (newer.currentClock.running == true) {
        let ta = timeAgo(newer.currentClock.ms);
        min.value = format(ta.minutes);
        sec.value = format(ta.seconds);
    }

})

</script>