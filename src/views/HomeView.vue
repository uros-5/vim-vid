<script setup lang="ts">
import HomeTile from '@/components/home/HomeTile.vue';
import HomeQuoute from '@/components/home/HomeQuoute.vue';
import HomeFooter from '@/components/home/HomeFooter.vue';
import home_svg from "@/assets/home_svg.json";

</script>

<template>
  <main class="flex flex-col items-center">
    <HomeQuoute />
    <div class="flex flex-col gap-10 justify-between lg:flex-row">
      <HomeTile v-for="i in home_svg.home_svg" :text="i.text" :path="i.path" :to-animate="i.toAnimate" />
    </div>
    <HomeFooter />
  </main>
</template>

