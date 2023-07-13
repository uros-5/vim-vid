<template>
  <section
    class="absolute bg-opacity-50 dark:bg-opacity-50 bg-slate-200 dark:bg-slate-950 w-[100vw] h-[100vh] top-0 z-10 opacity-100 transition-transform duration-500 translate-y-[-120%] border-0 border-b-8 border-black dark:border-white"
    :class="{ 'translate-y-[0]': mainStore.currentContext == EditorContext.Markers }"
  >
    <Transition>
      <div
        v-if="show"
        class="absolute w-1/2 top-1/4 lg:top-[35%] left-1/4 m-auto bg-slate-300 dark:bg-slate-700"
      >
        <h2 class="text-xl lg:text-3xl text-black dark:text-white text-center">Markers</h2>
        <div class="flex flex-col gap-5 text-xl justify-center items-center lg:text-3xl">
          <p
            class="text-black dark:text-white cursor-pointer p-2 m-3"
            :class="{
              'border border-black dark:border-white': isSelected(marker)
            }"
            v-for="marker in lastThree()"
          >
            #{{ marker.id }}
          </p>
          <p
            v-if="markersStore.markers.length == 0"
            class="text-black dark:text-white cursor-pointer p-2 m-3"
          >
            Markers are currently empty
          </p>
        </div>
      </div>
    </Transition>
  </section>
</template>

<script setup lang="ts">
import { useMarkers } from '@/stores/markers'
import { vimvid } from '@/stores/vimvid'
import { EditorContext, Marker, Markers } from '@/stores/vimvid-types'
import { onMounted, ref } from 'vue'

const mainStore = vimvid()
const markersStore = useMarkers()

const show = ref(false)

const lastThree = (): Markers => {
  return markersStore.markers.slice(markersStore.selected, markersStore.selected + 3)
}

function isSelected(marker: Marker): boolean {
  const clip = markersStore.markers[markersStore.selected]
  if (clip) {
    return marker.id == clip.id
  }
  return false
}

onMounted(() => (show.value = true))
</script>

<style>
h2 {
  font-family: 'Nunito Sans', sans-serif;
}

p {
  font-family: 'Poppins', sans-serif;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
