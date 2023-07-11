import { defineStore } from "pinia";
import { ref } from "vue";
import { emptyClip, type Clips, EditorAction } from "./vimvid-types";
import startSound from '@/assets/sounds/start.ogg'
import stopSound from '@/assets/sounds/stop.ogg'
import deleteSound from '@/assets/sounds/delete.ogg'
import { saveLocalStorage } from "./vimvid";

export const useClips = defineStore("clips", () => {
  const video = ref(null as HTMLVideoElement | null)
  const fileElem = ref(null as HTMLInputElement | null)
  const videoBlob = ref(null as null | Blob)
  const isRecording = ref(false)
  const currentSpeed = ref(1)
  const lastTime = ref(0)
  const clips = ref([] as Clips)
  const step = ref(3)
  const recordingClip = ref(emptyClip());
  const volume = ref(1);
  const otherVideo = ref(null as HTMLVideoElement | null)

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
    video,
    fileElem,
    videoBlob,
    isRecording,
    currentSpeed,
    lastTime,
    clips,
    step,
    recordingClip,
    volume,
    h() {
      if (video.value) video.value.currentTime! -= step.value
    },
    l() {
      if (video.value) video.value.currentTime! += step.value
    },
    k() {
      if (video.value) {
        video.value.paused ? video.value.play() : video.value.pause()
      }
    },
    o() {
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
    },
    x(justOne = true) {
      if (clips.value.length > 0) {
        if (justOne) clips.value.pop();
        else {
          clips.value = [];
        }
        saveLocalStorage('clips', clips.value);
        sound(EditorAction.DeleteLastClip);
      }
    },
    async y() {
      if (clips.value.length > 0) {
        let command = `#!/usr/bin/sh \nmkdir vimvid\nmkdir vimvid/clips vimvid/merged\n\nvidsrc=""\next=""\n`;
        let mergeCommand = "ffmpeg ";
        let mergeAudio = "";
        let mergeVideo = "";
        let filterArray = "";
        command += "\n#all clips\n";
        clips.value.forEach((item, i) => {
          command += `ffmpeg -ss ${item.start} -i "$vidsrc" -c:v copy -c:a copy -t ${item.end - item.start} "vimvid/clips/video-${item.id}.$ext"\n`;
          mergeCommand += `-i "vimvid/clips/video-${item.id}.$ext" `;
          filterArray += `[${i}:a] `
        })
        command += "\n#merging\n";
        mergeAudio = `${mergeCommand} -filter_complex "${filterArray}concat=n=${clips.value.length}:v=0:a=1 [a]" -map "[a]" "vimvid/merged/audio.aac"`;
        mergeVideo = `${mergeCommand} -filter_complex "${filterArray.replaceAll('a', 'v')}concat=n=${clips.value.length}:v=1:a=0 [v]" -map "[v]" "vimvid/merged/video.mp4"`;
        command += `${mergeAudio}\n${mergeVideo}\n`
        await navigator.clipboard.writeText(command);
      }
    },
    volumeUp() {
      if (volume.value <= 1) {
        volume.value += 0.1;
      }
    },
    volumeDown() {
      if (volume.value <= 1) {
        volume.value -= 0.1;
      }
      else { volume.value = 1; }
    },
    speedUp() {
      if (video.value) {
        currentSpeed.value += 0.3
        video.value.playbackRate = currentSpeed.value
      }
    },
    slowDown() {
      if (video.value) {
        currentSpeed.value -= 0.3
        video.value.playbackRate = currentSpeed.value
      }
    },
    open(e: KeyboardEvent) {
      e?.preventDefault()
      fileElem.value?.click()
    },
    saveOriginalVideo(vid: Blob) {
      videoBlob.value = vid;
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
    }
  }
});

function randomId() {
  return Math.floor(Math.random() * 1000);
}

