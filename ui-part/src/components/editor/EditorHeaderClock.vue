<template>
  <div
    @click="store.toggleClock()"
    class="flex flex-row text-5xl font-zector font-extrabold cursor-pointer active:text-slate-600"
    :class="{ 'text-red-400': store.isClockActive() == false }"
  >
    <div>{{ min }}</div>
    <div>:</div>
    <div>{{ sec }}</div>
  </div>
</template>

<script setup lang="ts">
import { timeAgo } from "@/plugins/timeAgo";
import { useFootballStore } from "@/stores/footballStore";
import { ref, watch, onMounted, onUnmounted } from "vue";

const min = ref("00");
const sec = ref("00");
const clock = ref({ min: 0, sec: 0 });
const store = useFootballStore();
const localInterval = ref(0);

onMounted(() => {
  if (store.editors[store.editor()].currentClock.running) {
    localInterval.value = setInterval(() => updateClock(), 1000);
  }
  watch(store.editors[store.editor()], async (old, newer) => {
    if (differentClock(newer.currentClock.customStart)) {
      updateClock();
    }
    if (newer.currentClock.running) {
      if (localInterval.value == 0) {
        localInterval.value = setInterval(() => updateClock(), 1000);
      }
    } else {
      clearInterval(localInterval.value);
      localInterval.value = 0;
    }
  });
});

onUnmounted(() => {
  clearInterval(localInterval.value);
});

function format(m: number): string {
  let s = `${m}`;
  if (s.length == 1) {
    s = `0${m}`;
  }
  return s;
}

function updateClock() {
  setTimeout(() => {
    let ta = timeAgo(store.currentClock(), false);
    min.value = format(ta.minutes);
    sec.value = format(ta.seconds);
  }, 300);
}

function differentClock(newClock: { min: number; sec: number }): boolean {
  if (newClock.min != clock.value.min || newClock.sec != clock.value.sec) {
    clock.value.min = newClock.min;
    clock.value.sec = newClock.sec;
    return true;
  }
  return false;
}
</script>
