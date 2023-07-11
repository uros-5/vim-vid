import { defineStore, type _ActionsTree } from 'pinia'
import keys from 'ctrl-keys'
import { Clips, EditorAction, EditorBuffer, Markers, type StorageSave } from './vimvid-types'
import { ref, watch } from 'vue'
import router from '@/router'
import { z } from 'zod'
import { useClips } from './clips'
import { useMarkers } from './markers'

export const vimvid = defineStore('vimvid', () => {
  const currentId = ref(0)
  const currentBuffer = ref(EditorBuffer.Home as EditorBuffer)
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
  watch(lastCommand, (v) => {
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
      switch (currentBuffer.value) {
        case EditorBuffer.Main: {
          clipsStore.h();
          break;
        }
        default: return;
      }
    })
    .add('l', () => {
      switch (currentBuffer.value) {
        case EditorBuffer.Main: {
          clipsStore.l();
          break;
        }
        default: return;
      }
    })
    .add('k', () => {
      switch (currentBuffer.value) {
        case EditorBuffer.Main: {
          clipsStore.k();
          break;
        }
        default: return;
      }
    })
    .add(',', () => {
      switch (currentBuffer.value) {
        case EditorBuffer.Main: {
          clipsStore.volumeDown();
          break;
        }
        default: return;
      }
    })
    .add('.', () => {
      switch (currentBuffer.value) {
        case EditorBuffer.Main: {
          clipsStore.volumeUp();
          break;
        }
        default: return;
      }
    })
    .add('m', () => {
      switch (currentBuffer.value) {
        case EditorBuffer.Markers: {
          markersStore.m();
          break;
        }
        default: return;
      }
    })
    .add('o', () => {
      switch (currentBuffer.value) {
        case EditorBuffer.Main: {
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
      currentBuffer.value = EditorBuffer.Home;
    })
    .add('shift+e', () => {
      router.push('/editor');
      currentBuffer.value = EditorBuffer.Main;
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
      switch (currentBuffer.value) {
        case EditorBuffer.Home: {
          currentBuffer.value = EditorBuffer.Main;
          router.push('/editor');
          break;
        }
        case EditorBuffer.Main: {
          currentBuffer.value = EditorBuffer.Secondary;
          break;
        }
        case EditorBuffer.Secondary: {
          currentBuffer.value = EditorBuffer.Clips;
          break;
        }
        case EditorBuffer.Clips: {
          currentBuffer.value = EditorBuffer.Markers;
          break;
        }
        case EditorBuffer.Markers: {
          currentBuffer.value = EditorBuffer.Home;
          router.push('/home');
          break;
        }
      }
    })

  window.addEventListener('keydown', handler.handle)

  return {
    currentId,
    currentBuffer,
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
