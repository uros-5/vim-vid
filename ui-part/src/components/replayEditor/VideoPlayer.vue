<template>
  <input type="file" v-if="file == null" v-on:change="change" />
  <video controls v-if="file != null">
    <source :src="newUrl()" />
  </video>
  <p>komanda je {{ store.command }}</p>
</template>

<script setup lang="ts">
import { useFootballStore } from "@/stores/footballStore";
import { ref } from "vue";

const store = useFootballStore();

function change(payload: Event) {
  file.value = (payload.target as HTMLInputElement).files![0] as Blob;
  setTimeout(() => {
    store.video = document.querySelector("video") as HTMLVideoElement;
    document.body.addEventListener("keydown", store.parseCommand);
  }, 300);
}

function newUrl(): string {
  return URL.createObjectURL(file.value);
}

const file = ref();
</script>
