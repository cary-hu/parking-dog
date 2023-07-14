import * as VueRouter from 'vue-router'

const routes = [
  { path: '/', component: () => import('@/pages/ParkingInfo.vue') },
  { path: '/test', component: () => import('@/pages/Test.vue') },
  { path: '/parking-lot', component: () => import('@/pages/ParkingLot.vue') },
]

const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes,
})

export default router
