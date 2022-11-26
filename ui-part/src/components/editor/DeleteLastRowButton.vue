<template>

    <button @click="store.deleteLastAction()" class="text-xl text-center py-3 text-red-300">Delete</button>

</template>

<script setup lang="ts">
import { useFootballStore } from '@/stores/footballStore';


const store = useFootballStore();

</script>