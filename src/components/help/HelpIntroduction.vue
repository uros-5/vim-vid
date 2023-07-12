<template>
  <p
    class="text-xl lg:text-3xl text-slate-950 dark:text-slate-200 lg:leading-[2.1em] lg:text-justify selection:bg-green-700"
  >
    Current keybindings depends on the
    <span @mouseover="contextHover" class="font-bold p-2 bg-slate-400 dark:bg-slate-800"
      >context</span
    >
    in which they are used. For example if you are in
    <RouterLink class="underline" to="/editor">editor</RouterLink> page and selected context is your
    clips(<i>element below main video player</i>) then your
    <code class="font-bold p-2 bg-slate-400 dark:bg-slate-800">h or l</code> command will select one
    of your clips. Selected clips can be previewed on second video player. If same commands are
    executed in main context, main video will go backwards/forwards by one step(<i
      >default value is 3 seconds</i
    >).<br />
    In future releases we will enable modifying default keybindings through simple JSON file. For
    now check table down bellow or read source code(<i>TypeScript</i>)
    <a class="underline underline-offset-4" href="https://github.com">here</a>
  </p>
</template>

<script setup lang="ts">
function contextHover(e: MouseEvent) {}
</script>

<style scoped></style>
