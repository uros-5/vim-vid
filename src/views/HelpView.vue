<template>
  <!-- -->
  <section class="m-auto lg:w-4/5 lg:h-full">
    <div class="flex flex-col justify-center gap-6 px-3 my-6">
      <HelpIntroduction />
      <HelpTable />
    </div>
  </section>
</template>

<script setup lang="ts">
import HelpIntroduction from '@/components/help/HelpIntroduction.vue'
import HelpTable from '@/components/help/HelpTable.vue'
import { onMounted } from 'vue'

onMounted(() => {
  window.scroll({ top: 0, behavior: 'smooth' })
})
</script>

<style scoped>
p {
  font-family: 'Forum', cursive;
}

.main-page {
  line-height: 2em;
}
</style>
