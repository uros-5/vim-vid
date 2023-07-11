import { z } from 'zod'

export enum EditorContext {
  Home,
  Main,
  Secondary,
  Clips,
  Markers
}

export const Clip = z.object({
  id: z.number(),
  start: z.number(),
  end: z.number(),
  toAdd: z.number()
})
export type Clip = z.infer<typeof Clip>

export const Clips = z.array(Clip)
export type Clips = z.infer<typeof Clips>

export const Marker = z.object({
  id: z.number()
})
export type Marker = z.infer<typeof Marker>

export const Markers = z.array(Marker)
export type Markers = z.infer<typeof Markers>

export type StorageSave = "darkMode" | "clips" | "markers" | "lastTime";

export enum EditorAction {
  Nothing,
  GoLeft,
  GoRight,
  GoUp,
  GoDown,
  StartRecording,
  StopRecording,
  Play,
  Pause,
  DeleteLastClip,
  SpeedUp,
  SlowDown,
  OpenHelp,
  GoToHome,
  MoveClip,
  CopyCommand,
  MoveToBeginning,
  Clear
}

export function emptyClip(): Clip {
  return { start: 0, end: 0, id: 0, toAdd: 0 }
}

export function bufferStr(buffer: EditorContext): string {
  switch (buffer) {
    case EditorContext.Home: return "Home";
    case EditorContext.Main: return "Main";
    case EditorContext.Secondary: return "Secondary Video Player";
    case EditorContext.Clips: return "Clips";
    case EditorContext.Markers: return "Markers";
  }
}

export function actionStr(action: EditorAction): string {
  switch(action) {
  case EditorAction.Nothing: return "";
  case EditorAction.GoLeft: return "Left";
  case EditorAction.GoRight: return "Right";
  case EditorAction.GoUp: return "";
  case EditorAction.GoDown: return "";
  case EditorAction.StartRecording: return "Started recording";
  case EditorAction.StopRecording: return "Stopped recording";
  case EditorAction.Play: return "Play";
  case EditorAction.Pause: return "Pause";
  case EditorAction.DeleteLastClip: return "Last clip deleted";
  case EditorAction.SpeedUp: return "Speed up video";
  case EditorAction.SlowDown: return "Slow down video";
  case EditorAction.OpenHelp: return "Open help";
  case EditorAction.GoToHome: return "";
  case EditorAction.MoveClip: return "Moving clip";
  case EditorAction.CopyCommand: return "Copied ffmpeg commands";
  case EditorAction.MoveToBeginning: return "Move clip to beginning";
  case EditorAction.Clear: return "All clips deleted";
}
}
