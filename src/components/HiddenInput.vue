<template>
  <div class="hidden">
    <input
      ref="inputElement"
      v-on:change="newFile"
      class="fill-slate-950 dark:fill-slate-200"
      type="file"
      accept="video/mp4"
    />
    <span class="fill-black dark:fill-white"></span>
  </div>
</template>

<script setup lang="ts">
import { useClips } from '@/stores/clips'
import { vimvid } from '@/stores/vimvid'
import { EditorBuffer } from '@/stores/vimvid-types'
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const clipsStore = useClips()
const mainStore = vimvid()
const inputElement = ref(null as null | HTMLInputElement)
const router = useRouter()

watch(inputElement, (n) => {
  if (n) {
    clipsStore.setInput(n)
  }
})

function newFile(payload: Event) {
  let tempBlob = (payload.target as HTMLInputElement).files?.item(0)
  if (tempBlob) {
    let cr = router.currentRoute.value.fullPath
    if (cr.includes('/help')) {
      router.push('/editor')
    } else {
      router.push('/editor')
      clipsStore.saveOriginalVideo(tempBlob)
      mainStore.currentBuffer = EditorBuffer.Main
    }
  }
}
</script>
