import { defineStore, type _ActionsTree } from 'pinia'
import keys from 'ctrl-keys'
import { Clips, EditorAction, EditorContext, Markers, type StorageSave } from './vimvid-types'
import { ref, watch } from 'vue'
import router from '@/router'
import { z } from 'zod'
import { useClips } from './clips'
import { useMarkers } from './markers'

export const vimvid = defineStore('vimvid', () => {
  const currentId = ref(0)
  const currentContext = ref(EditorContext.Home as EditorContext)
  const lastCommand = ref("");
  const version = '0.0.0'
  const isSaved = ref(false)
  const ls = readLocalStorage();
  const darkMode = ref(false);

  const clipsStore = useClips();
  const markersStore = useMarkers();
  clipsStore.lastTime = ls.lastTime;
  clipsStore.clips = ls.clips;
  markersStore.markers = ls.markers;
  darkMode.value = ls.darkMode;

  let last = 0;
  watch(lastCommand, () => {
    last += 1;
    const old = last;
    setTimeout(() => {
      if (old == last) {
        lastCommand.value = "";
      }
    }, 3000)
  }, { deep: true })

  const handler = keys()
  handler
    .add('h', () => {
      lastCommand.value = "h";
      switch (currentContext.value) {
        case EditorContext.Main: {
          clipsStore.h();
          break;
        }
        case EditorContext.Clips: {
          clipsStore.previous();
          break;
        }
        default: return;
      }
    })
    .add('l', () => {
      lastCommand.value = "l";
      switch (currentContext.value) {
        case EditorContext.Main: {
          clipsStore.l();
          break;
        }
        case EditorContext.Clips: {
          clipsStore.next();
          break;
        }
        default: return;
      }
    })
    .add('k', () => {
      lastCommand.value = "k";
      switch (currentContext.value) {
        case EditorContext.Main: {
          clipsStore.k();
          break;
        }
        default: return;
      }
    })
    .add('i', () => {
      lastCommand.value = "i";
      switch (currentContext.value) {
        case EditorContext.Clips:
          {
            clipsStore.m(true);
            break;
          }
        default: return;
      }
    })
    .add('a', () => {
      lastCommand.value = "a";
      switch (currentContext.value) {
        case EditorContext.Clips:
          {
            clipsStore.m(false);
            break;
          }
        default: return;
      }
    })
    .add(',', () => {
      lastCommand.value = ",";
      switch (currentContext.value) {
        case EditorContext.Main: {
          clipsStore.volumeDown();
          break;
        }
        default: return;
      }
    })
    .add('.', () => {
      lastCommand.value = ".";
      switch (currentContext.value) {
        case EditorContext.Main: {
          clipsStore.volumeUp();
          break;
        }
        default: return;
      }
    })
    .add('m', () => {
      lastCommand.value = "m";
      switch (currentContext.value) {
        case EditorContext.Markers: {
          markersStore.m();
          break;
        }
        default: return;
      }
    })
    .add('o', () => {
      lastCommand.value = "o";
      switch (currentContext.value) {
        case EditorContext.Main: {
          clipsStore.o();
          break;
        }
        default: return;
      }
    })
    .add('0', () => {
      lastCommand.value = "0";
      switch (currentContext.value) {
        case EditorContext.Clips:
          {
            clipsStore.selected = 0;

          }
        default: break;
      }
    })
    .add('shift+$', () => {
      lastCommand.value = "shift+$";
      switch (currentContext.value) {
        case EditorContext.Clips:
          {
            clipsStore.selected = clipsStore.clips.length - 1;
          }
        default: break;
      }

    })
    .add('shift+<', () => {
      lastCommand.value = "shift+<";
      clipsStore.slowDown();
    })
    .add('shift+>', () => {
      lastCommand.value = "shift+>";
      clipsStore.speedUp();
    })
    .add('x', () => {
      lastCommand.value = "x";
      switch (currentContext.value) {
        case EditorContext.Main: clipsStore.x(true, false); break;
        case EditorContext.Clips: clipsStore.x(true, true); break;
        default: break;
      }
    })
    .add('shift+x', () => {
      lastCommand.value = "shift+x";
      clipsStore.x(false);
    })
    .add('shift+h', (e) => {
      lastCommand.value = "shift+h";
      router.push('/')
      currentContext.value = EditorContext.Home;
    })
    .add('shift+h', (e) => {
      lastCommand.value = "shift+h";
      e?.preventDefault();
      router.push('/')
      currentContext.value = EditorContext.Home;
    })
    .add('e', (e) => {
      e?.preventDefault();
      lastCommand.value = "e";
      router.push('/editor');
      currentContext.value = EditorContext.Main;
      window.scrollTo(0, 0)
    })
    .add('shift+?', (e) => {
      lastCommand.value = "shift+?";
      router.push('/help');
      currentContext.value = EditorContext.Main;
    })
    .add('shift+l', () => {
      lastCommand.value = "shift+l";
    })
    .add('ctrl+?', () => {
      lastCommand.value = "ctrl+?";
    })
    .add('shift+d', () => {
      lastCommand.value = "shift+d";
      const data = document.querySelector('html')?.classList.toggle('dark')
      saveLocalStorage('darkMode', data);
    })
    .add('shift+y', async () => {
      lastCommand.value = "shift+y";

      clipsStore.y();
    })
    .add('ctrl+o', (e) => {
      lastCommand.value = "ctrl+o";
      if (e) clipsStore.open(e);
    })
    .add('shift+m', () => {
      lastCommand.value = "shift+m";
    })
    .add('c', (e) => {
      e?.preventDefault();
      lastCommand.value = "c";
      currentContext.value = EditorContext.Clips;
    })
    .add('ctrl+m', () => {
      // currentContext.value = EditorContext.Markers;
    })
    .add('0', () => { })
    .add('escape', (e) => {
      lastCommand.value = "escape";
      e?.preventDefault();
      currentContext.value = EditorContext.Main;
    })
    .add('enter', (e) => {
      e?.preventDefault();
      lastCommand.value = "enter";
      switch (currentContext.value) {
        case EditorContext.Clips: {
          clipsStore.enter();
          break;
        }
        default: break;
      }
    })
    .add('space', () => {
      return;
    })

  window.addEventListener('keydown', handler.handle)

  return {
    currentId,
    currentContext,
    lastCommand,
    version,
    isSaved,
    darkMode,
  }
})

function readLocalStorage() {
  let darkMode = z.boolean().safeParse(JSON.parse(localStorage.getItem('darkMode')!));
  let clips = Clips.safeParse(JSON.parse(localStorage.getItem('clips')!));
  let markers = Markers.safeParse(JSON.parse(localStorage.getItem('markers')!));
  let lastTime = z.number().safeParse(JSON.parse(localStorage.getItem('lastTime')!));
  let obj = { darkMode: false, clips: [] as Clips, markers: [] as Markers, lastTime: 0 };
  if (darkMode.success) obj.darkMode = darkMode.data;
  if (clips.success) obj.clips = clips.data
  if (markers.success) obj.markers = markers.data;
  if (lastTime.success) obj.lastTime = lastTime.data
  return obj;
}

export function saveLocalStorage(key: StorageSave, value: any) {
  localStorage.setItem(key, JSON.stringify(value))
}
