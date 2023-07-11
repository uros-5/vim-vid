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
        console.log('delete now')
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
        default: return;
      }
    })
    .add('l', () => {
      switch (currentContext.value) {
        case EditorContext.Main: {
          clipsStore.l();
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
    .add('shift+<', () => {
      clipsStore.slowDown();
    })
    .add('shift+>', () => {
      clipsStore.speedUp();
    })
    .add('x', () => {
      clipsStore.x();
    })
    .add('shift+x', () => { clipsStore.x(false); })
    .add('shift+h', () => {
      router.push('/')
      currentContext.value = EditorContext.Home;
    })
    .add('shift+e', () => {
      router.push('/editor');
      currentContext.value = EditorContext.Main;
    })
    .add('shift+l', () => { })
    .add('shift+?', () => { })
    .add('shift+d', () => {
      const data = document.querySelector('#app')?.classList.toggle('dark')
      saveLocalStorage('darkMode', data);
    })
    .add('shift+m', () => { })
    .add('ctrl+c', () => { })
    .add('ctrl+m', () => { })
    .add('0', () => { })
    .add('shift+y', async () => { clipsStore.y(); })
    .add('ctrl+l', (e) => { e?.preventDefault(); })
    .add('ctrl+o', (e) => { if (e) clipsStore.open(e); })
    .add('space', () => {
    return ;
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
    currentBuffer: currentContext,
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
