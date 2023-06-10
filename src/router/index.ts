import * as VueRouter from 'vue-router'

const routes = [
  { path: '/', component: import('@/pages/Home.vue') },
  { path: '/parking-lot', component: import('@/pages/ParkingLot.vue') },
  { path: '/parking', component: import('@/pages/ParkingInfo.vue') },
]

const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes,
})

export default router
