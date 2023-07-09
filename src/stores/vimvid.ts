import { defineStore } from 'pinia'
import keys from 'ctrl-keys'
import type { Clips, EditorAction, EditorBuffer, Markers } from './vimvid-types'
import { ref } from 'vue'
import router from '@/router'

export const vimvid = defineStore('vimvid', () => {
  const video = ref(null as HTMLVideoElement | null)
  const otherVideo = ref(null as HTMLVideoElement | null)
  const fileElem = ref(null as HTMLInputElement | null)
  const videoBlob = ref(null as null | Blob)
  const isRecording = ref(false)
  const currentSpeed = ref(1)
  const lastTime = ref(0)
  const clips = ref([] as Clips)
  const currentId = ref(0)
  const currentBuffer = ref(3 as EditorBuffer)
  const lastCommand = ref([0, ''] as [EditorAction, string])
  const version = '0.0.0'
  const isSaved = ref(false)
  const start = ref(0)
  const markers = ref([] as Markers)
  const step = ref(3)

  const handler = keys()
  handler
    .add('h', () => {
      if (video.value) video.value.currentTime! -= step.value
    })
    .add('l', () => {
      if (video.value) video.value.currentTime! += step.value
    })
    .add('k', () => {
      if (video.value) {
        video.value.paused ? video.value.play() : video.value.pause()
      }
    })
    .add('i', () => {})
    .add('shift+<', () => {
      if (video.value) {
        currentSpeed.value -= 0.3
        video.value.playbackRate = currentSpeed.value
      }
    })
    .add('shift+>', () => {
      if (video.value) {
        currentSpeed.value += 0.3
        video.value.playbackRate = currentSpeed.value
      }
    })
    .add('x', () => {})
    .add('shift+h', () => {
      router.push('/')
    })
    .add('shift+e', () => {
      router.push('/editor')
    })
    .add('shift+l', () => {})
    .add('shift+?', () => {})
    .add('shift+d', () => {
      // store somewhere
      document.querySelector('#app')?.classList.toggle('dark')
    })
    .add('shift+m', () => {})
    .add('ctrl+c', () => {})
    .add('ctrl+m', () => {})
    .add('0', () => {})
    .add('shift+c', () => {})
    .add('ctrl+o', (e) => {
      e?.preventDefault()
      fileElem.value?.click()
    })

  window.addEventListener('keydown', handler.handle)

  return {
    video: video,
    videoBlob,
    isRecording,
    currentSpeed,
    lastTime,
    clips,
    currentId,
    currentBuffer,
    lastCommand,
    version,
    isSaved,
    start,
    markers,
    fileElem,
    saveOriginalVideo(vid: Blob) {
      videoBlob.value = vid
    },
    setInput(video: HTMLInputElement) {
      fileElem.value = video
    },
    newUrl(): string {
      if (videoBlob.value) {
        return URL.createObjectURL(videoBlob.value!)
      } else {
        return ''
      }
    },
    setVideo(element: HTMLVideoElement) {
      video.value = element
      video.value.currentTime = lastTime.value
    },
    setTime(time: number) {
      lastTime.value = time
    }
  }
})
