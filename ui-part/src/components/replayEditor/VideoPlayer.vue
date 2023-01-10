<template>
  <div class="col-span-3 row-start-1  lg:col-start-2 lg:col-span-3 lg:row-start-1 lg:row-span-3">
  <input type="file" v-if="file == null" v-on:change="change" />
  <video controls v-if="file != null">
    <source :src="newUrl()" />
  </video>
  </div>
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
