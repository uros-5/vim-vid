<template>
  <div
    class="col-start-2 row-start-5 lg:col-start-5 lg:row-start-3 text-center py-2 text-xl lg:text-2xl lg:flex lg:justify-center lg:items-center"
  >
    <p class="text-slate-950 dark:text-slate-200 lg:text-left">
      Pressed:

      <transition name="com">
        <b v-if="store.lastCommand != ''">{{ store.lastCommand }}</b>
      </transition>
    </p>
  </div>
</template>

<script setup lang="ts">
import { vimvid } from '@/stores/vimvid'
const store = vimvid()
</script>

<style scoped>
div {
  font-family: 'Rufina', serif;
}

.com-enter-active,
.com-leave-active {
  transition: opacity 0.5s ease;
}

.com-enter-from,
.com-leave-to {
  opacity: 0;
}
</style>

<style lang="postcss"></style>
