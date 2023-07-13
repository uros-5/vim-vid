<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import MainHeader from './components/icons/MainHeader.vue'
import HiddenInput from './components/HiddenInput.vue'
import MarkersModal from '@/components/editor/MarkersModal.vue'
import { vimvid } from './stores/vimvid'
import { onMounted } from 'vue'
import { useClips } from './stores/clips'

const store = vimvid()
const clipsStore = useClips()
const route = useRoute()
const screenRoutes = ['editor']

onMounted(() => {
  setTimeout(() => {
    if (store.darkMode) document.querySelector('html')?.classList.toggle('dark')
  })
})

function isRoute(): boolean {
  if (route.name) {
    return screenRoutes.includes(route.name.toString())
  }
  return false
}
</script>

<template>
  <div
    class=""
    :class="{
      // 'h-full': route.name == 'home',
      // 'h-screen': clipsStore.videoBlob == null && isRoute(),
      // 'lg: h-full': route.name == 'help'
    }"
  >
    <transition name="header"> <MainHeader /> </transition>
    <RouterView v-slot="{ Component }">
      <transition name="main">
        <component :is="Component" />
      </transition>
    </RouterView>
    <HiddenInput />
    <MarkersModal />
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
