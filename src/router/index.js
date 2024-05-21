import {createRouter, createWebHistory,createWebHashHistory} from 'vue-router'
import {defineAsyncComponent} from 'vue'


const router = createRouter({
  history: createWebHashHistory(),
  routes: [

    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      name:'Home',
      component: () => import('../views/Home.vue')
    },
    {
      path: '/camera',
      name:'camera',
      component: () => import('../components/Camera.vue')
    },
    {
      path: '/face',
      name:'face',
      component: () => import('../views/Face.vue')
    },
    {
      path: '/verifyIdentityFace',
      name:'VerifyIdentityFace',
      component: () => import('../views/verifyIdentityFace.vue')
    },
    {
      path: '/faceComparison',
      name:'FaceComparison',
      component: () => import('../views/FaceComparison.vue')
    },
    {
      path: '/faceRegisterAndComparison',
      name:'FaceRegisterAndComparison',
      component: () => import('../views/FaceRegisterAndComparison.vue')
    },
    {
      path: '/livingDetection',
      name:'LivingDetection',
      component: () => import('../views/LivingDetection.vue')
    },
    {
      path: '/microphoneDecection',
      name:'MicrophoneDecection',
      component: () => import('../views/MicrophoneDecection.vue')
    },
    {
      path: '/realTimeDetection',
      name:'RealTiemDetection',
      component: () => import('../views/RealTimeDetection.vue')
    },
    {
      path: '/fullScreen',
      name:'FullScreen',
      component: () => import('../views/FullScreen.vue')
    },
    {
      path: '/cameraCheck',
      name:'cameraCheck',
      component: () => import('../views/CameraCheck.vue')
    },
    {
      path: '/test2',
      name:'test2',
      component: () => import('../views/Test2.vue')
    },
    {
      path: '/test3',
      name:'new',
      component: () => import('../views/Test3.vue')
    },
  ]
})

export default router