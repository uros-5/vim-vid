<script setup lang="ts">
import { RouterView } from 'vue-router'
import MainHeader from './components/icons/MainHeader.vue';
</script>

<template>
<div class="bg-gradient-to-b from-slate-300 from-20% dark:from-10% dark:from-slate-800 to-slate-500 dark:to-slate-600 w-full h-full h-screen bg-no-repeat">
  <MainHeader />
  <RouterView v-slot="{ Component }">
    <transition name="fade">
      <component :is="Component" />
    </transition>
  </RouterView>  
</div>

</template>
