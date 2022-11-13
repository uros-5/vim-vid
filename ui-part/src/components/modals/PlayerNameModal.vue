<template>
    <div class="absolute left-0 right-0 mx-auto w-full h-full bg-slate-200 bg-opacity-60 z-10 font-zector">
        <div class="flex flex-col items-center flex-wrap gap-3 text-4xl justify-center my-[50%]">
            <div>
                <input v-model="name" placeholder="Player name" class="p-2 bg-slate-700 rounded" size="13" type="text" />
            </div>
            <div>
                <button @click="confirm()" class="bg-slate-500 shadow shadow-slate-500 p-2 rounded-lg row-start-2 col-start-2 font-lekton">
                    Confirm
                </button>

            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useFootballStore } from '@/stores/footballStore';
import { ref } from 'vue';

const store = useFootballStore();
const name = ref("");

function confirm() {
    store.updateName(name.value);
    store.enableModal(1);
}

</script>