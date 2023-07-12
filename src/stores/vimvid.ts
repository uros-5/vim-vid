import { defineStore, type _ActionsTree } from 'pinia'
import keys from 'ctrl-keys'
import { Clips, EditorAction, EditorContext, Markers, type StorageSave } from './vimvid-types'
import { ref, watch } from 'vue'
import router from '@/router'
import { z } from 'zod'
import { useClips } from './clips'
import { useMarkers } from './markers'
import { isComputedPropertyName } from 'typescript/lib/tsserverlibrary'

export const vimvid = defineStore('vimvid', () => {
  const currentId = ref(0)
  const currentContext = ref(EditorContext.Home as EditorContext)
  const lastCommand = ref(EditorAction.Nothing);
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
        lastCommand.value = EditorAction.Nothing;
      }
    }, 3000)
  })

  const handler = keys()
  handler
    .add('h', () => {
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
      switch (currentContext.value) {
        case EditorContext.Main: {
          clipsStore.k();
          break;
        }
        default: return;
      }
    })
    .add('i', () => {
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
      switch (currentContext.value) {
        case EditorContext.Main: {
          clipsStore.volumeDown();
          break;
        }
        default: return;
      }
    })
    .add('.', () => {
      switch (currentContext.value) {
        case EditorContext.Main: {
          clipsStore.volumeUp();
          break;
        }
        default: return;
      }
    })
    .add('m', () => {
      switch (currentContext.value) {
        case EditorContext.Markers: {
          markersStore.m();
          break;
        }
        default: return;
      }
    })
    .add('o', () => {
      switch (currentContext.value) {
        case EditorContext.Main: {
          clipsStore.o();
          break;
        }
        default: return;
      }
    })
    .add('0', () => {
      switch (currentContext.value) {
        case EditorContext.Clips:
          {
            clipsStore.selected = 0;

          }
        default: break;
      }
    })
    .add('shift+<', () => {
      clipsStore.slowDown();
    })
    .add('shift+>', () => {
      clipsStore.speedUp();
    })
    .add('x', () => {
      switch (currentContext.value) {
        case EditorContext.Main: clipsStore.x(true,false); break;
        case EditorContext.Clips: clipsStore.x(true, true); break;
        default: break;
      }
    })
    .add('shift+x', () => { clipsStore.x(false); })
    .add('shift+h', (e) => {
      router.push('/')
      currentContext.value = EditorContext.Home;
    })
    .add('ctrl+h', (e) => {
      e?.preventDefault();
      router.push('/')
      currentContext.value = EditorContext.Home;
    })
    .add('ctrl+e', (e) => {
      e?.preventDefault();
      router.push('/editor');
      currentContext.value = EditorContext.Main;
    })
    .add('shift+?', () => {
      router.push('/help');
      currentContext.value = EditorContext.Main;
    })
    .add('shift+l', () => { })
    .add('ctrl+?', () => { })
    .add('shift+d', () => {
      const data = document.querySelector('html')?.classList.toggle('dark')
      saveLocalStorage('darkMode', data);
    })
    .add('shift+y', async () => { clipsStore.y(); })
    .add('ctrl+o', (e) => { if (e) clipsStore.open(e); })
    .add('shift+m', () => { })
    .add('ctrl+a', (e) => {
      e?.preventDefault();
      currentContext.value = EditorContext.Clips;
    })
    .add('ctrl+m', () => {
      currentContext.value = EditorContext.Markers;
    })
    .add('0', () => { })
    .add('escape', (e) => {
      e?.preventDefault();
      currentContext.value = EditorContext.Main;
    })
    .add('space', () => {
      return;
      // switch (currentContext.value) {
      //   case EditorContext.Home: {
      //     currentContext.value = EditorContext.Main;
      //     router.push('/editor');
      //     break;
      //   }
      //   case EditorContext.Main: {
      //     currentContext.value = EditorContext.Secondary;
      //     break;
      //   }
      //   case EditorContext.Secondary: {
      //     currentContext.value = EditorContext.Clips;
      //     break;
      //   }
      //   case EditorContext.Clips: {
      //     currentContext.value = EditorContext.Markers;
      //     break;
      //   }
      //   case EditorContext.Markers: {
      //     currentContext.value = EditorContext.Home;
      //     router.push('/home');
      //     break;
      //   }
      // }
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
