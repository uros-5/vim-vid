<template>
    <div class="absolute left-0 right-0 mx-auto w-full h-full bg-slate-200 bg-opacity-60 z-10 font-zector">
        <div class="flex flex-row flex-wrap gap-3 text-4xl justify-center my-[50%]">
            <div>
                <input placeholder="minute" class="p-2 bg-slate-700 rounded" type="text" size="3" maxlength="3" />
            </div>
            <div>
                <input placeholder="seconds" class="p-2 bg-slate-700 rounded" type="text" size="3" maxlength="3" />
            </div>
            <button class="bg-slate-500 shadow shadow-slate-500 rounded-lg row-start-2 col-start-2 font-lekton">
                Confirm
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">

</script>