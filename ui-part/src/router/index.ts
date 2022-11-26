import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Editor from "@/views/Editor.vue"
import EditorReplay from '@/views/EditorReplay.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Editor
    },
    {
      path: '/editor_replay',
      name: 'editor_replay',
      component: EditorReplay
    },
  ]
})

export default router
