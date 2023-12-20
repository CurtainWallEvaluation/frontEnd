import { createRouter, createWebHistory } from 'vue-router'
import EvaluationInfo from '../views/EvaluationInfo.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'curtainMain',
      component: EvaluationInfo
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      // component: () => import('...vue')
    },
  ]
})

export default router
