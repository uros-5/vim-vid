<template>
  <div class="col-start-1 col-end-4 row-start-4 lg:col-start-1 lg:col-span-4 lg:row-start-4">
    <div
      id="statusbar"
      class="flex gap-1 border-0 border-r-8 border-slate-500 dark:border-slate-700 shadow-md lg:shadow-lg shadow-black bg-slate-400 dark:bg-slate-700 bg-gradient-to-r from-slate-500 from-40% to-slate-600 to-90% text-slate-900 dark:text-slate-200 px-3 py-2 mx-2 overflow-x-scroll"
      :class="{ 'h-3/5': store.clips.length == 0 }"
    >
      <StatusBarVideo v-for="i in store.clips" :clip="i" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { vimvid } from '@/stores/vimvid'
import StatusBarVideo from './StatusBarVideo.vue'

const store = vimvid()
</script>

<style scoped></style>
