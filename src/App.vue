<script setup lang="ts">
import { RouterView } from 'vue-router'
import MainHeader from './components/icons/MainHeader.vue'
import HiddenInput from './components/HiddenInput.vue'
import { vimvid } from './stores/vimvid'
import { onMounted } from 'vue'

const store = vimvid()
onMounted(() => {
  setTimeout(() => {
    console.log(store.darkMode)
    if (store.darkMode) document.querySelector('#app')?.classList.toggle('dark')
  })
})
</script>

<template>
  <div
    class="bg-gradient-to-b from-slate-300 from-20% dark:from-10% dark:from-slate-800 to-slate-500 dark:to-slate-600 w-full bg-no-repeat"
  >
    <MainHeader />
    <RouterView v-slot="{ Component }">
      <transition name="fade">
        <component :is="Component" />
      </transition>
    </RouterView>
    <HiddenInput />
  </div>
</template>
