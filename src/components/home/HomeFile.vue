<template>
<p class="text-2xl mb-10">
Import your video
</p>
<div class="border-2 border-b-2 rounded fill-slate-900 dark:fill-slate-400 shadow-md lg:rounded-lg shadow-black dark:shadow-white border-slate-400 dark:border-slate-700 flex p-10 lg:p-20">
  <svg class="animate-bounce svg-duration" xmlns="http://www.w3.org/2000/svg" :width="currentSize" :height="currentSize" viewBox="0 0 24 24"><path d="M14 2H4v20h16V8l-6-6zm-1 7V3.5L18.5 9H13zm1 5l2-1.06v4.12L14 16v2H8v-6h6v2z"/></svg>
</div>


</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

const currentSize = ref(120);
let toUpdate = true;

function resize(event: UIEvent) {
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

onMounted(() => {
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
}

</style>