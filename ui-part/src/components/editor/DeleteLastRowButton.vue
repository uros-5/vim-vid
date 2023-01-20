<template lang="pug">
button(@click="store.deleteLastAction()"
class="text-xl text-center py-3 lg:px-9 text-red-300") Delete
</template>

<script setup lang="ts">
import { useFootballStore } from "@/stores/footballStore";

const store = useFootballStore();
</script>
