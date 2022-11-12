<template>
    <div class="border-2 border-solid border-black py-3">
        <div class="text-center">
            P{{ id }}
        </div>
        <div class="flex justify-around">
            <button>
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

const props = defineProps<{ id: number }>();

</script>