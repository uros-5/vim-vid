<template>
    <div class="row-start-4 col-span-3 grid grid-cols-3 justify-between bg-slate-500 rounded font-zector font-bold">
        <PlayerTab @click="store.selectPlayer(i-1)" v-for="i in [1, 2, 3]" :key="i-1" :id="i-1" />
    </div>
</template>

<script setup lang="ts">
import PlayerTab from '@/components/editor/PlayerTab.vue';
import { useFootballStore } from '@/stores/footballStore';
const store = useFootballStore();
</script>