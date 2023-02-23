import {createRouter, createWebHistory,createWebHashHistory} from 'vue-router'
import {defineAsyncComponent} from 'vue'


const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/camera',
      name:'camera',
      component: () => import('../components/Camera.vue')
    },
    {
      path: '/face',
      name:'face',
      component: () => import('../components/Face.vue')
    },
    {
      path: '/faceTest',
      name:'faceTest',
      component: () => import('../components/FaceTest.vue')
    },
    {
      path: '/HelloWorld',
      name:'HelloWorld',
      component: () => import('../components/HelloWorld.vue')
    }
  ]
})

export default router