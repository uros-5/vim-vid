<template lang="pug">
a(@mouseover="url = store.downloadPlayer()" :href="url" :download="store.fileName()")
  InlineSvg(:src="dlIcon" class="w-[50px] lg:w-[80px]")
</template>

<script setup lang="ts">
import dlIcon from "@/assets/icons/download.svg";
import { useFootballStore } from "@/stores/footballStore";
import { ref } from "vue";
import InlineSvg from "vue-inline-svg";

const store = useFootballStore();

const url = ref("");
</script>

<style scoped>
img {
  color: white;
}

a {
  color: inherit;
}

a:hover {
  color: inherit !important;
  background-color: inherit;
  cursor: pointer;
}
</style>
