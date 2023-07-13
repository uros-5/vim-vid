<template>
  <div class="col-start-1 col-span-3 row-start-1 row-span-3 lg:col-start-1 lg:col-span-4">
    <video
      v-if="store.newUrl() != ''"
      class="m-auto w-full p-3 lg:m-2 lg:p-0"
      :style="styleVideo()"
      ref="videoElement"
      :src="store.newUrl()"
      controls
      source
    />
    <div
      class="bg-neutral-300 dark:bg-slate-700 dark:text-white my-4 bg-opacity-50 m-auto w-full p-3 lg:m-2 lg:p-0 h-full text-center flex justify-center items-center lg:text-3xl font-bold"
      v-else-if="store.newUrl() == ''"
    >
      <p class="cursor-pointer" @click="store.fileElem?.click()">Please insert video</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useClips } from '@/stores/clips'
import { onBeforeUnmount, onMounted, onUnmounted, ref, watch } from 'vue'

const store = useClips()
const videoElement = ref(null as HTMLVideoElement | null)
let tempInterval = 0

function updateTime() {
  if (videoElement.value) {
    store.setTime(videoElement.value.currentTime)
  }
}

function styleVideo(): string {
  if (store.newUrl() == '') {
    return 'width: 100%'
  } else {
    return ''
  }
}

const watcher = watch(videoElement, (n) => {
  if (n) {
    videoElement.value = n
    store.setVideo(n)
  }
})

onMounted(() => {
  tempInterval = window.setInterval(() => {
    updateTime()
  }, 5000)
})

onBeforeUnmount(() => updateTime())

onUnmounted(() => {
  watcher()
  clearInterval(tempInterval)
})
</script>

<style scoped>
p {
  font-family: 'Nunito Sans', sans-serif;
}
</style>
