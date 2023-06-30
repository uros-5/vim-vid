<template>
  <div class="col-start-2 col-end-2 lg:col-start-1 lg:col-span-4 row-span-3">
    <video :style="styleVideo()" ref="videoElement" :src="store.newUrl()" controls source />
  </div>
</template>

<script setup lang="ts">
import { vimvid } from '@/stores/vimvid'
import { onBeforeUnmount, onMounted, onUnmounted, ref, watch } from 'vue'

const store = vimvid()
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
  tempInterval = setInterval(() => {
    updateTime()
  }, 5000)
})

onBeforeUnmount(() => updateTime())

onUnmounted(() => {
  watcher()
  clearInterval(tempInterval)
})
</script>

<style scoped></style>
