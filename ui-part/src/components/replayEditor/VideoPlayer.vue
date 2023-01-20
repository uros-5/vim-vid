<template lang="pug">
div(class="col-span-3 row-start-1 lg:col-start-2 lg:col-span-3 lg:row-start-1 lg:row-span-3")
  div(class="relative overflow-hidden flex justify-center hover:cursor-help")
    button(class="hover:cursor-help border-2 border-slate-400 px-2 py-4 rounded-md text-sm lg:text-lg font-bold"
    v-if="file == null") Upload a file
  input(class="text-[100px] absolute left-0 top-0 opacity-0 cursor-help" type="file" name="myfile"
    v-if="file == null" v-on:change="change")
  video(v-if="file != null" :src="newUrl()" controls source)
</template>

<script setup lang="ts">
import { useFootballStore } from "@/stores/footballStore";
import { ref, onUnmounted } from "vue";

const store = useFootballStore();

onUnmounted(() => {
  document.body.removeEventListener("keydown", store.parseCommand);
});

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
