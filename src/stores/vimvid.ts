import { defineStore, type _ActionsTree } from 'pinia'
import keys from 'ctrl-keys'
import { Clips,  EditorAction, type EditorBuffer, Markers,  type StorageSave } from './vimvid-types'
import { ref } from 'vue'
import router from '@/router'
import { z } from 'zod'
import { useClips } from './clips'
import { useMarkers } from './markers'

export const vimvid = defineStore('vimvid', () => {
  const currentId = ref(0)
  const currentBuffer = ref(3 as EditorBuffer)
  const lastCommand = ref([0, ''] as [EditorAction, string])
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

  const handler = keys()
  handler
    .add('h', () => {})
    .add('l', () => {})
    .add('k', () => {})
    .add(',', () => {})
    .add('.', () => {})
    .add('m', () => {})
    .add('o', () => {})
    .add('shift+<', () => {})
    .add('shift+>', () => {})
    .add('x', () => {})
    .add('shift+h', () => {
      router.push('/')
    })
    .add('shift+e', () => {
      router.push('/editor')
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
    .add('shift+y', async () => {})
    .add('ctrl+l', (e) => { e?.preventDefault(); })
    .add('ctrl+o', (e) => {})

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
