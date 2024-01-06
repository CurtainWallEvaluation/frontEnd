import { createRouter, createWebHistory } from 'vue-router'
import oriImageDetail from '../views/oriImageDetail.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'oriImageDetail',
      component: oriImageDetail
    },
    {
      path: '/oriImageOverview',
      name: 'oriImageOverview',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/DataOverView.vue')
    },
    {
      path: '/taskOverview',
      name: 'taskOverview',
      componen: () => import('../views/taskOverview.vue')
    }
  ]
})

export default router
