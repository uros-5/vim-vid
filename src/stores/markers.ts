import { defineStore } from "pinia";
import { ref } from "vue";
import type { Markers } from "./vimvid-types";
import { useClips } from "./clips";
import { saveLocalStorage } from "./vimvid";

export const useMarkers = defineStore("markers", () => {

  const markers = ref([] as Markers);
  const clipsStore = useClips();

  return {
    markers,
    m() {
      const last = clipsStore.clips.at(-1);
      if (last) {
        if (!markers.value.find(item => item.id == last.id)) {
          markers.value.push({ id: last.id })
          saveLocalStorage('markers', markers.value);
        }
      }
    }
  }

})