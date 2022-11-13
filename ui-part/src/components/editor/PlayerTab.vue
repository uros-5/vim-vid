<template>
    <div class="border-2 border-solid border-black py-3 cursor-pointer"
        :class="{ 'border-white': store.selectedPlayer() == id }">
        <div class="text-center">
            {{ name() }}
        </div>
        <div class="flex justify-around">
            <button @click="store.enableModal(1)">
                <InlineSvg :src="textIcon" />
            </button>
            <button>
                <InlineSvg :src="delIcon" />
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
    let name = store.$state.games[props.id].match_info.title;
    return name == "" ? `P${props.id}` : name
}

</script>