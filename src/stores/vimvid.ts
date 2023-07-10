import { defineStore, type _ActionsTree } from 'pinia'
import keys from 'ctrl-keys'
import { Clips, Clip, EditorAction, type EditorBuffer, Markers, emptyClip, type StorageSave } from './vimvid-types'
import { ref } from 'vue'
import router from '@/router'
import { z } from 'zod'
import startSound from '@/assets/sounds/start.ogg'
import stopSound from '@/assets/sounds/stop.ogg'
import deleteSound from '@/assets/sounds/delete.ogg'

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
  const ls = readLocalStorage();
  const darkMode = ref(false);
  const volume = ref(1);
  lastTime.value = ls.lastTime;
  clips.value = ls.clips;
  markers.value = ls.markers;
  darkMode.value = ls.darkMode;

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
    .add(',', () => {
      if (volume.value <= 1) {
        volume.value += 0.1;
      }
    })
    .add('.', () => {
      if (volume.value <= 1) {
        volume.value -= 0.1;
      }
      else { volume.value = 1; }
    })
    .add('m', () => {
      const last = clips.value.at(-1);
      if (last) {
        if (!markers.value.find(item => item.id == last.id)) {
          markers.value.push({ id: last.id })
          saveLocalStorage('markers', markers.value);
        }
      }
    })
    .add('o', () => {
      if (video.value) {
        switch (isRecording.value) {
          case false:
            {
              isRecording.value = true;
              recordingClip.value.start = video.value.currentTime;
              sound(EditorAction.StartRecording);
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
              let elem = document.querySelector('#statusbar');
              if (elem) {
                elem.scrollLeft = elem.scrollWidth;
              }
              saveLocalStorage('clips', clips.value);
              sound(EditorAction.StopRecording);
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
    .add('x', () => {
      if (clips.value.length > 0) {
        clips.value.pop();
        saveLocalStorage('clips', clips.value);
        sound(EditorAction.DeleteLastClip);
      }
    })
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
    .add('shift+y', async () => {
      if (clips.value.length > 0) {
        let command = `#!/usr/bin/sh \nmkdir vimvid\nmkdir vimvid/clips vimvid/merged\n\nvidsrc=""\n`;
        let mergeCommand = "ffmpeg ";
        let mergeAudio = "";
        let mergeVideo = "";
        let filterArray = "";
        command += "\n#all clips\n";
        clips.value.forEach((item,i)=> {
          command += `ffmpeg -ss ${item.start} -i "$vidsrc" -c:v copy -c:a copy -t ${item.end - item.start} "vimvid/clips/video-${item.id}.mp4"\n`;
          mergeCommand += `-i "vimvid/clips/video-${item.id}.mp4" `;
          filterArray += `[${i}:a] `
        })
        command += "\n#merging\n";
        mergeAudio = `${mergeCommand} -filter_complex "${filterArray}concat=n=${clips.value.length}:v=0:a=1 [a]" -map "[a]" "vimvid/merged/audio.aac"`;
        mergeVideo = `${mergeCommand} -filter_complex "${filterArray.replaceAll('a', 'v')}concat=n=${clips.value.length}:v=1:a=0 [v]" -map "[v]" "vimvid/merged/video.mp4"`;
        command += `${mergeAudio}\n${mergeVideo}\n`
        await navigator.clipboard.writeText(command);
      }
    })
    .add('ctrl+l', (e) => { e?.preventDefault(); console.log(`oooh here l`) })
    .add('ctrl+o', (e) => {
      e?.preventDefault()
      fileElem.value?.click()
    })

  window.addEventListener('keydown', handler.handle)


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
    a.volume = volume.value
    a.play();
  }
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
    darkMode,
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
      saveLocalStorage('lastTime', time)
    },
  }
})

function randomId() {
  return Math.floor(Math.random() * 1000);
}

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

function saveLocalStorage(key: StorageSave, value: any) {
  localStorage.setItem(key, JSON.stringify(value))
}



