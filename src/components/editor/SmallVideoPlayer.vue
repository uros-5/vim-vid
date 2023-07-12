<template>
  <div
    class="col-start-2 row-start-6 row-span-2 lg:col-start-5 lg:row-start-1 lg:row-span-2 lg:flex lg:items-center lg:justify-center"
  >
    <video
      class="m-2"
      :style="styleVideo()"
      ref="videoElement"
      :src="getSource()"
      controls
      source
    ></video>
  </div>
</template>

<script setup lang="ts">
import { useClips } from '@/stores/clips'
import { vimvid } from '@/stores/vimvid'
import { EditorContext } from '@/stores/vimvid-types'
import { ref, watch } from 'vue'

const clipsStore = useClips()
const mainStore = vimvid()
const videoElement = ref(null as null | HTMLVideoElement)

watch(videoElement, (n) => {
  if (n) {
    clipsStore.otherVideo = n
  }
})

function styleVideo(): string {
  if ('' == '') {
    return 'width: 100%'
  } else {
    return ''
  }
}

function getSource(): string {
  if (mainStore.currentContext == EditorContext.Secondary) {
    return clipsStore.newUrl()
  }
  return ''
}
</script>

<style scoped></style>
