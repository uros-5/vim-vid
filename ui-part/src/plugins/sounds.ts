import startSound from "@/assets/sounds/start.ogg";
import stopSound from "@/assets/sounds/stop.ogg";
import otherSound from "@/assets/sounds/other.ogg";
import deleteSound from "@/assets/sounds/delete.ogg";

export function play(sound: string) {
  const audio = new Audio();
  switch (sound) {
    case "start":
      audio.src = startSound;
      break;
    case "stop":
      audio.src = stopSound;
      break;
    case "other":
      audio.src = otherSound;
      break;
    case "delete":
      audio.src = deleteSound;
      break;
  }
  audio.play();
}
