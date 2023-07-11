import { z } from 'zod'

export enum EditorBuffer {
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
  CopyCutCommand,
  CopyMergeCommand,
  MoveToBeginning,
  Clear
}

export function emptyClip(): Clip {
  return { start: 0, end: 0, id: 0, toAdd: 0 }
}

export function bufferStr(buffer: EditorBuffer) {
  switch (buffer) {
    case EditorBuffer.Home: return "Home";
    case EditorBuffer.Main: return "Main";
    case EditorBuffer.Secondary: return "Secondary Video Player";
    case EditorBuffer.Clips: return "Clips";
    case EditorBuffer.Markers: return "Markers";
  }
}
