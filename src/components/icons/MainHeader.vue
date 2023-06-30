<template>
  <header class="flex justify-center py-5 gap-2" :class="{ hidden: isNotHome() }">
    <VimVidLogo class="hover:scale-110 transition-[transform]" />
  </header>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import VimVidLogo from './VimVidLogo.vue'
const router = useRouter()

function isNotHome() {
  let cr = router.currentRoute.value.fullPath
  if (cr.endsWith('editor')) {
    return true
  } else if (cr.endsWith('help')) {
    return true
  }
  return false
}
</script>

<style></style>
