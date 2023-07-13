import { defineStore, type _ActionsTree } from 'pinia'
import keys from 'ctrl-keys'
import { Clips, EditorContext, Markers, type StorageSave } from './vimvid-types'
import { ref, watch } from 'vue'
import router from '@/router'
import { z } from 'zod'
import { useClips } from './clips'
import { useMarkers } from './markers'

export const vimvid = defineStore('vimvid', () => {
  const currentId = ref(0)
  const currentContext = ref(EditorContext.Home as EditorContext)
  const lastCommand = ref("");
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
        last = 0;
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
      }
    })
    .add('k', () => {
      lastCommand.value = "k";
      switch (currentContext.value) {
        case EditorContext.Main: {
          clipsStore.k();
          break;
        }
        case EditorContext.Markers: {
          markersStore.k();
          break;
        }
      }
    })
    .add('j', () => {
      lastCommand.value = "k";
      switch (currentContext.value) {
        case EditorContext.Markers: {
          markersStore.j();
          break;
        }
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
        case EditorContext.Markers: {

          markersStore.move(true);
          break;
        }
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
        case EditorContext.Markers: {
          markersStore.move(false);
          break;
        }
      }
    })
    .add(',', () => {
      lastCommand.value = ",";
      switch (currentContext.value) {
        case EditorContext.Clips: {
          clipsStore.volumeDown(false);
          break;
        }
        case EditorContext.Main: {
          clipsStore.volumeDown(true);
          break;
        }
      }
    })
    .add('.', () => {
      lastCommand.value = ".";
      switch (currentContext.value) {
        case EditorContext.Clips: {
          clipsStore.volumeUp(false);
          break;
        }
        case EditorContext.Main: {
          clipsStore.volumeUp(true);
          break;
        }
      }
    })
    .add('m', () => {
      lastCommand.value = "m";
      switch (currentContext.value) {
        case EditorContext.Main:
        case EditorContext.Clips: {
          markersStore.m();
          break;
        }
      }
    })
    .add('o', () => {
      lastCommand.value = "o";
      switch (currentContext.value) {
        case EditorContext.Main: {
          clipsStore.o();
          break;
        }
      }
    })
    .add('0', () => {
      lastCommand.value = "0";
      switch (currentContext.value) {
        case EditorContext.Clips:
          {
            clipsStore.selected = 0;
      break;

          }
        case EditorContext.Main:
          {
            clipsStore.zero();
            break;
          }
      }
    })
    .add('shift+$', () => {
      lastCommand.value = "shift+$";
      switch (currentContext.value) {
        case EditorContext.Clips:
          {
            clipsStore.selected = clipsStore.clips.length - 1;
            break;
          }
        case EditorContext.Main: {
          clipsStore.lastFrame();
          break;
        }

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
        case EditorContext.Markers: markersStore.x(); break;
      }
    })
    .add('shift+x', () => {
      lastCommand.value = "shift+x";
      switch (currentContext.value) {
        case EditorContext.Main:
        case EditorContext.Clips:
          clipsStore.x(false); break;
        case EditorContext.Markers: markersStore.X();
      }

    })
    .add('shift+h', (e) => {
      e?.preventDefault();
      lastCommand.value = "shift+h";
      router.push('/')
      currentContext.value = EditorContext.Home;
    })
    .add('e', (e) => {
      e?.preventDefault();
      lastCommand.value = "e";
      router.push('/editor');
      currentContext.value = EditorContext.Main;
      window.scrollTo(0, 0);
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
    .add('shift+m', (e) => {
      e?.preventDefault();
      lastCommand.value = "shift+m";
      markersStore.safeMarkers();
      if (currentContext.value == EditorContext.Markers) {
        currentContext.value = EditorContext.Main;
      }
      else {
        window.scrollTo(0, 0);
        currentContext.value = EditorContext.Markers;
      }
    })
    .add('c', (e) => {
      e?.preventDefault();
      lastCommand.value = "c";
      currentContext.value = EditorContext.Clips;
      clipsStore.selected = clipsStore.clips.length - 1;
    })
    .add('escape', (e) => {
      lastCommand.value = "escape";
      e?.preventDefault();
      currentContext.value = EditorContext.Main;
    })
    .add('space', (e) => {
      e?.preventDefault();
      lastCommand.value = "space";
      switch (currentContext.value) {
        case EditorContext.Clips: {
          clipsStore.enter();
          break;
        }
      }
    })

  window.addEventListener('keydown', handler.handle)

  return {
    currentId,
    currentContext,
    lastCommand,
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
