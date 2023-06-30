<template>
<section>
<p class="text-3xl text-center mb-10 selection:bg-green-100 dark:selection:bg-green-700 text-slate-950 dark:text-slate-200">
  {{ props.text }}
</p>
<div @click="uploadFile" class="transition-[background] border-2 border-b-2 bg-slate-400/[0.2] hover:bg-slate-400/[0.6] dark:bg-slate-800/[0.3] dark:hover:bg-slate-800/[0.6] rounded fill-slate-900 dark:fill-slate-400 shadow-md lg:rounded-lg shadow-black dark:shadow-slate-500 border-slate-400 dark:border-slate-700 flex p-8 m-auto lg:p-20 hover:cursor-pointer">
  <router-link :to="props.route" class="m-auto">
    <svg :class="{'transition animate-bounce svg-duration hover:animate-stop': props.toAnimate, 'svg-duration': !props.toAnimate}" class="" xmlns="http://www.w3.org/2000/svg" :width="currentSize" :height="currentSize" viewBox="0 0 24 24"><path :d="props.path"/></svg>
  </router-link>
</div>
</section>

</template>

<script setup lang="ts">
import { vimvid } from '@/stores/vimvid';
import { onMounted, onUnmounted, ref } from 'vue';

const props = defineProps<{text: string, path: string, toAnimate: boolean, route: string}>();
const currentSize = ref(120);
let toUpdate = true;
const store = vimvid() 

function resize() {
  let width = document.documentElement.clientWidth;
  if(width >= 1024) {
    if (toUpdate){
      currentSize.value = 180;
      toUpdate = false;
    }
  }
  else {
    toUpdate = true;
    currentSize.value = 120;
  }
}

function uploadFile() {
  if(props.toAnimate) {
    store.fileElem?.click()
  }
}


onMounted(() => {
  resize()
  addEventListener("resize", resize)
})

onUnmounted(() => removeEventListener('resize', resize))

</script>

<style scoped>
p {
  font-family: 'Nunito Sans', sans-serif;  
}

.svg-duration {
  animation-duration: 3s;
  transition: scale 0.2s;
}

.svg-duration:hover {
  animation-play-state: paused;
  scale: 1.08;
  transition: scale 0.5s;
}


</style>