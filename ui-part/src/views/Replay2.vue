<template>
  <input type="file" v-on:change="change" />
  <video controls v-if="file != null">
    <source :src="newUrl()" />
  </video>
</template>

<script setup lang="ts">
import { ref } from "vue";

function change(payload: Event) {
  file.value = (payload.target as HTMLInputElement).files![0] as Blob;
  //file.value = payload.currentTarget;
}

function newUrl(): string {
  return URL.createObjectURL(file.value);
}

const file = ref();
</script>

<style scoped></style>
