<template>
  <div class="col-start-1 col-end-4 row-start-4 lg:col-start-1 lg:col-span-4 lg:row-start-4">
    <div
      id="statusbar"
      class="flex gap-1 border-0 border-r-8 dark:border-r-0 border-slate-500 dark:border-slate-700 shadow-md lg:shadow-lg shadow-black bg-slate-300 dark:bg-slate-700 bg-gradient-to-l text-slate-900 dark:text-slate-200 px-3 py-2 mx-2 overflow-x-scroll"
      :class="{ 'h-[80px] lg:h-3/5 ': isEmpty }"
    >
      <TransitionGroup name="sbv">
        <StatusBarVideo v-for="(i, index) in store.clips" :key="i.id" :clip="i" :index="index" />

        <div
          class="flex text-center justify-center text-black dark:text-white font-semibold"
          v-if="isEmpty"
        >
          <p class="text-center text-2xl">Your video clips will appear here.</p>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import StatusBarVideo from './StatusBarVideo.vue'
import { useClips } from '@/stores/clips'

const store = useClips()
const isEmpty = computed(() => {
  return store.clips.length == 0
})
</script>

<style scoped>
.sbv-enter-active,
.sbv-leave-active {
  transition: transform 0.5s ease;
}

.sbv-enter-from,
.sbv-leave-to {
  transform: scale(0);
}

p {
  font-family: 'Nunito Sans', sans-serif;
}
</style>
