<template>
  <div class="hidden">
    <input ref="inputElement" v-on:change="newFile" class="fill-slate-950 dark:fill-slate-200" type="file" accept="video/mp4" />
    <span class="fill-black dark:fill-white"></span>
  </div>
</template>

<script setup lang="ts">
import { vimvid } from '@/stores/vimvid';
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const store = vimvid() 
const inputElement = ref(null as null | HTMLInputElement);
const router = useRouter();

watch(inputElement, (n) => {
  if(n) {
    store.setInput(n)
  }
})

function newFile(payload: Event) {
  let tempBlob = (payload.target as HTMLInputElement).files?.item(0);
  if (tempBlob) {
    let cr = router.currentRoute.value.fullPath;
    if (cr.includes("/editor")) {
      router.push('/editor')
    }
    else if (cr.includes("/help")) {
      router.push('/editor')
    }
    else {
      router.push('/editor')
      store.saveOriginalVideo(tempBlob)
    }
  }
}

</script>
