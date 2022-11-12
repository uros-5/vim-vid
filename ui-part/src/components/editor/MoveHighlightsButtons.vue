<template>
    
    <div class="row-start-2 col-start-3 font-zector font-bold">
        <div class="flex flex-row p-2 ml-5 justify-around gap-2">
            <button v-for="i in [1,2,3]" class="p-1 bg-slate-600 shadow shadow-slate-600 rounded-sm">
                <span class="px-1">{{ i }}</span>
            </button>
        </div>
        <DeleteLastRowButton />
    </div>

</template>

<script setup lang="ts">
import DeleteLastRowButton from './DeleteLastRowButton.vue';


</script>