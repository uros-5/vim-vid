<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import MainHeader from './components/icons/MainHeader.vue'
import HiddenInput from './components/HiddenInput.vue'
import { vimvid } from './stores/vimvid'
import { onMounted } from 'vue'
import { useClips } from './stores/clips'

const store = vimvid()
const clipsStore = useClips()
const route = useRoute()

onMounted(() => {
  setTimeout(() => {
    if (store.darkMode) document.querySelector('#app')?.classList.toggle('dark')
  })
})
</script>

<template>
  <div
    class="bg-gradient-to-b from-slate-300 from-20% dark:from-10% dark:from-slate-800 to-slate-500 dark:to-slate-600 w-full bg-no-repeat"
    :class="{
      'h-full': route.name == 'home',
      'h-screen': clipsStore.videoBlob == null && route.name == 'editor'
    }"
  >
    <transition name="header"> <MainHeader /> </transition>
    <RouterView v-slot="{ Component }">
      <transition name="main">
        <component :is="Component" />
      </transition>
    </RouterView>
    <HiddenInput />
  </div>
</template>

<style scoped>
.main-enter-from,
.main-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

.main-enter-active,
.main-leave-active {
  transition: opacity 0.4s, transform 0.5s;
}

.header-enter-from,
.header-leave-to {
  transform: translateY(-100px);
}

.header-enter-active,
.header-leave-active {
  transition: transform 0.5s ease-in;
}
</style>
