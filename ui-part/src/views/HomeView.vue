<script setup lang="ts">
</script>
<template lang="pug">
main(class="grid grid-cols-5 home-view justify-center gap-5 text-3xl my-[10%]")
  router-link(to="/" class="col-start-2 col-span-3 row-start-1 hover:divide-emerald-700 rounded-lg text-transparent")
    img(src="@/assets/vimfootball.svg")
  router-link(to="/editor" class="col-start-2 row-start-2 rounded-md text-xl text-center lg:text-4xl font-lekton bg-slate-500 text-white p-5") Live Editor
  router-link(to="/editor_replay" class="col-start-4 row-start-2 rounded-md text-xl text-center lg:text-4xl font-lekton bg-slate-500 text-white p-5" ) Replay Editor
</template>

<style scoped>
.home-view {
  grid-template-columns: 0.2fr 0.5fr 0.5fr 0.5fr 0.2fr;
}
</style>
