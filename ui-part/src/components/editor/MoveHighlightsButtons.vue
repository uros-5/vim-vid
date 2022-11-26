<template>
    
    <div class="row-start-3 col-span-3 font-zector font-bold">
        <div class="flex flex-row p-2 ml-5 justify-around gap-2">
            <button @click="store.addActionToOthers(i-1)" v-for="i in [1,2,3]" class="px-3 py-5 bg-slate-600 hover:bg-slate-500 shadow shadow-slate-600 transition active:bg-red-400 hover:transition-colors rounded-sm">
                <span class="px-1">{{ i }}</span>
            </button>
        </div>
        <DeleteLastRowButton />
    </div>

</template>

<script setup lang="ts">
import { useFootballStore } from '@/stores/footballStore';
import DeleteLastRowButton from './DeleteLastRowButton.vue';

const store = useFootballStore();

</script>