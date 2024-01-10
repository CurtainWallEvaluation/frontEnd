import { createRouter, createWebHistory } from 'vue-router'
import oriImageDetail from '../views/oriImageDetail.vue'
import homePage from '../views/homePage.vue'
import loginPage from '../views/loginPage.vue'
import {ElMessage} from "element-plus";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: loginPage,
    },
    {
      path: '/homepage',
      component: homePage,
      children: [
        {
          // 默认上传照片
          path: '',
          name: 'imgUpload',
          component: () => import('../views/imgUpload.vue'),
        },
        {
          // 个人信息
          path: 'profile',
          name: 'profile',
          component: () => import('../views/profile.vue'),
        },
        {
          // 任务历史
          path: 'taskHistory',
          name: 'taskHistory',
          component: () => import('../views/taskHistory.vue'),
        },
      ]
    },
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

// 导航守卫，前置处理
// router.beforeEach((to, from, next) => {
//   let isAuthenticated = !!localStorage.getItem('userInfo')
//   // 如果路由要跳转到除了登录和注册的界面的话就判断是否已经登录，如果没有登录就强制跳到登录界面
//   if (to.path !== '/' && !isAuthenticated) {
//     next({ path: '/' })
//     ElMessage({
//       message: '请先登录！',
//       type: 'warning',
//     })
//   } else next()
// })

export default router
