<template>
  <div
    class="col-start-2 row-start-5 lg:col-start-5 lg:row-start-3 text-center py-2 text-xl lg:text-2xl lg:flex lg:justify-center lg:items-center"
  >
    <transition name="current-command">
      <p class="text-slate-950 dark:text-slate-200">Pressed: <b>com</b></p>
    </transition>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
div {
  font-family: 'Rufina', serif;
}

.current-command-enter-active,
.current-command-leave-active {
  transition: transform 5.5s ease;
}

.current-command-enter-from,
.current-command-leave-to {
  scale: 0;
}
</style>

<style lang="postcss"></style>
