import { createRouter, createWebHistory } from 'vue-router'
import oriImageDetail from '../views/oriImageDetail.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/oriImageDetail/:taskID/:originalImgID',
      name: 'oriImageDetail',
      component: () => import('../views/oriImageDetail.vue'),
      props: true,
    },
    {
      path: '/oriImageDataView',
      name: 'oriImageDataView',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/DataOverView.vue')
    },
    {
      path: '/task/:taskID',
      name: 'taskOverview',
      component: () => import('../views/taskOverview.vue'),
      props: true,
    }
  ]
})

export default router
