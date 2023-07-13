<template>
  <div class="relative overflow-x-auto">
    <table class="w-full text-sm text-left text-slate-500 dark:text-slate-400">
      <thead
        class="text-xs lg:text-2xl text-slate-900 uppercase bg-slate-400 dark:bg-slate-700 dark:text-slate-400"
      >
        <tr>
          <th scope="col" class="px-6 py-3">Command</th>
          <th scope="col" class="px-6 py-3">Action</th>
          <th scope="col" class="px-6 py-3">Aditional info</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, index) in commands.all"
          :key="item.command"
          :data-index="index"
          class="bg-slate-300 border-b dark:bg-slate-800 dark:border-gray-700"
        >
          <th
            scope="row"
            class="px-6 py-4 font-bold text-sm lg:text-lg text-slate-900 whitespace-nowrap dark:text-white"
          >
            {{ item.command }}
          </th>
          <td class="px-6 py-4 text-sm lg:text-lg text-slate-800 dark:text-slate-200">
            {{ item.action }}
          </td>
          <td class="px-6 py-4 text-sm lg:text-lg text-slate-800 dark:text-slate-200">
            {{ item.info }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import commands from '@/assets/commands.json'
</script>

<style scoped>
thead {
  font-family: 'Nunito Sans', sans-serif;
}
</style>
