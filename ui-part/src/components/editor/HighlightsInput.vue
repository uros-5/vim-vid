<template>
    <div class="row-start-5 col-span-3 flex flex-col items-center justify-center">
        <div class="flex flex-row gap-3">
           <input disabled v-model="store.currentAction.min" class="bg-slate-700 rounded" type="text" size="3" maxlength="3" /> 
           <input disabled v-model="store.currentAction.sec" class="bg-slate-700 rounded" type="text" size="3" maxlength="3"/> 
           <input disabled v-model="store.currentAction.to_add" class="bg-slate-700 rounded" type="text" size="3" maxlength="3"/> 
        </div>
        <button class="p-2 text-2xl">
            <InlineSvg :src="icon" />
        </button>
    </div>



</template>

<script setup lang="ts">
import InlineSvg from "vue-inline-svg";
import icon from "@/assets/icons/material-symbols add.svg"
import { useFootballStore } from "@/stores/footballStore";

const store = useFootballStore();

</script>