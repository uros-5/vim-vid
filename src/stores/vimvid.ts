import { defineStore } from "pinia";
import keys from 'ctrl-keys'

const vimvid = defineStore('vimvid', () => {
  const handler = keys()
  handler
    .add('h', () => {
      console.log('h')
    })
    .add('l', () => {
      console.log('l')
    })
    .add('k', () => {
      console.log('k')
    })
    .add('j', () => {
      console.log('j')
    })
    .add('i', () => {
      console.log('i')
    })
    .add('shift+j', () => {
      console.log('shift+j')
    })
    .add('shift+k', () => {
      console.log('shift+k')
    })
    .add('shift+x', () => {
      console.log('shift+x')
    })
    .add('shift+<', () => {
      console.log('shift+<')
    })
    .add('shift+>', () => {
      console.log('shift+>')
    })
    .add('shift+h', () => {
      console.log('shift+h')
    })
    .add('shift+l', () => {
      console.log('shift+l')
    })
    .add('shift+?', () => {
      console.log('?')
    })
    .add('shift+m', () => {
      console.log('shift+m')
    })
    .add('ctrl+c', () => {
      console.log('ctrl+c')
    })
    .add('ctrl+m', () => {
      console.log('ctrl+m')
    })
    .add('0', () => {
      console.log('0')
    })
    .add('shift+c', () => {
      console.log('shift+c')
    })

  window.addEventListener('keydown', handler.handle)
  return {
    //
  }
})

export enum Acton {
  GoLeft, GoRight, GoUp, GoDown,
  StartRecording, StopRecording,
  Play, Pause,
  DeleteLastClip,
  SpeedUp, SlowDown,
  OpenHelp, GoToHome, MoveClip,
  CopyCutCommand, CopyMergeCommand,
  MoveToBeginning,
  Clear
} 