import { defineStore } from 'pinia'
import keys from 'ctrl-keys'
import { type Clips, type Clip, type EditorAction, type EditorBuffer, type Markers, emptyClip } from './vimvid-types'
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
  const markers = ref([] as Markers)
  const step = ref(3)
  const recordingClip = ref(emptyClip());

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
    .add('i', () => { })
    .add('o', () => {
      if (video.value) {
        switch (isRecording.value) {
          case false:
            {
              console.log('recording');
              isRecording.value = true;
              recordingClip.value.start = video.value.currentTime;
              break;
            }
          case true:
            {
              isRecording.value = false;
              recordingClip.value.end = video.value.currentTime;
              if (recordingClip.value.end <= recordingClip.value.start) {
                recordingClip.value.start = 0;
                recordingClip.value.end = 0;
                return;
              }
              let id = 0;
              while (true) {
                id = randomId();
                if (clips.value.find(item => item.id == id) == null) {
                  break;
                }
              }
              recordingClip.value.id = id;
              clips.value.push(recordingClip.value);
              recordingClip.value = emptyClip();
              console.log('recording done');
              let elem = document.querySelector('#statusbar');
              if (elem) {
                elem.scrollLeft = elem.scrollWidth;
              }
              
              break;
            }
        }
      }
    })
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
    .add('x', () => { })
    .add('shift+h', () => {
      router.push('/')
    })
    .add('shift+e', () => {
      router.push('/editor')
    })
    .add('shift+l', () => { })
    .add('shift+?', () => { })
    .add('shift+d', () => {
      // store somewhere
      document.querySelector('#app')?.classList.toggle('dark')
    })
    .add('shift+m', () => { })
    .add('ctrl+c', () => { })
    .add('ctrl+m', () => { })
    .add('0', () => { })
    .add('shift+c', () => { })
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
    markers,
    fileElem,
    recordingClip,
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

function randomId() {
  return Math.floor(Math.random() * 1000);
}
