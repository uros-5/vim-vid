<template>
  <p class="text-5xl p-10 mt-10 selection:bg-green-200 selection:text-black text-slate-950 dark:text-slate-200">Created by <a class="underline" href="https://github.com/uros-5">uros-5</a></p>
  <InlineSvg @click="toggle" class="m-5 hover:cursor-pointer" src="src/assets/darkmodeicon.svg" />
</template>

<script setup lang="ts">
import InlineSvg from "vue-inline-svg"

function toggle() {
  let a = document.querySelector("#app")?.classList.toggle('dark')
}

</script>

<style scoped>

p {
  font-family: 'Alumni Sans Pinstripe', sans-serif;
}

</style>