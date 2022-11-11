<template>
    <div>
        <div class="text-center">
            P{{ id }}
        </div>
        <div class="flex justify-around">
            <p>T</p>
            <p>X</p>
        </div>
    </div>
</template>

<script setup lang="ts">

const props = defineProps<{ id: number }>();

</script>