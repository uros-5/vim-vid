<template>

    <button @click="store.deleteLastAction()" class="text-xl text-center px-4">Delete</button>

</template>

<script setup lang="ts">
import { useFootballStore } from '@/stores/footballStore';


const store = useFootballStore();

</script>