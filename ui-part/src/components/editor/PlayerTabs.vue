<template>
    <div class="row-start-4 col-span-3 grid grid-cols-3 justify-between">
        <PlayerTab v-for="i in [1, 2, 3]" :key="i" :id="i" />
    </div>
</template>

<script setup lang="ts">
import PlayerTab from '@/components/editor/PlayerTab.vue';
</script>