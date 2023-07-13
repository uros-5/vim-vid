import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { EditorAction, type Markers } from "./vimvid-types";
import { useClips } from "./clips";
import { saveLocalStorage } from "./vimvid";
import startSound from '@/assets/sounds/start.ogg'
import stopSound from '@/assets/sounds/stop.ogg'
import deleteSound from '@/assets/sounds/delete.ogg'

export const useMarkers = defineStore("markers", () => {
  const markers = ref([] as Markers);
  const clipsStore = useClips();
  const selected = ref(0);

  watch(markers, () => {
    selected.value = markers.value.length - 1;
  })

  function sound(action: EditorAction) {
    let audio;
    switch (action) {
      case EditorAction.StartRecording:
        { audio = startSound; break; }
      case EditorAction.StopRecording:
        { audio = stopSound; break; }
      case EditorAction.DeleteLastClip:
        { audio = deleteSound; break; }
      default: return;
    }
    const a = new Audio(audio);
    a.volume = 0.5;
     a.play();
  }

  return {
    markers,
    selected,
    m() {
      const clip = clipsStore.clips.at(clipsStore.selected);
      if (clip) {
        if (!markers.value.find(item => item.id == clip.id)) {
          markers.value.push({ id: clip.id })
          saveLocalStorage('markers', markers.value);
        }
      }
    },
    j() {
      selected.value += 1;
      if (selected.value >= markers.value.length - 1) {
        selected.value = markers.value.length - 1
      }
    },
    k() {
      selected.value -= 1;
      if (selected.value <= 0) {
        selected.value = 0;
      }
    },
    x() {
      markers.value.splice(selected.value, 1);
      saveLocalStorage('markers', markers.value);
    },
    X() {
      markers.value = [];
      saveLocalStorage('markers', markers.value);
    },

    move(before = true) {
      if (clipsStore.deletedClip) {
        const n = before ? selected.value : selected.value + 1;
        const start = clipsStore.clips.slice(0, n);
        const end = clipsStore.clips.slice(n);
        start.push(clipsStore.deletedClip);
        clipsStore.clips = start.concat(end);
        clipsStore.deletedClip = null;
        saveLocalStorage('clips', clipsStore.clips);
        sound(EditorAction.StopRecording);
      }

    },

    safeMarkers() {
      markers.value = markers.value.filter(item => {
        return clipsStore.clips.find(item2 =>
          item2.id == item.id
        );
      });
    }
  }

})