<template>
    <div class="border-2 border-solid border-black py-5 cursor-pointer"
        :class="{ 'border-white': store.selectedPlayer() == id, 'bg-slate-300 text-slate-900': store.isActive() }">
        <div class="text-center my-9">
            {{ name() }}
        </div>
        <div class="flex justify-around gap-3">
            <button @click="store.enableModal(1)">
                <InlineSvg :src="textIcon" />
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">

import InlineSvg from "vue-inline-svg";
import delIcon from "@/assets/icons/ic baseline-delete.svg";
import textIcon from "@/assets/icons/mdi-pencil-minus.svg";
import { useFootballStore } from "@/stores/footballStore";

const props = defineProps<{ id: number }>();
const store = useFootballStore();

function name(): string {
    let name = store.$state.editors[store.editor()].games[props.id].match_info.title;
    return name == "" ? `P${props.id}` : name
}

</script>