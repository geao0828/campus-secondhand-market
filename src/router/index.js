import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '../components/AppLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: AppLayout,
      children: [
        { path: '', name: 'home', component: () => import('../views/HomeView.vue') },
        { path: 'products', name: 'productList', component: () => import('../views/ProductListView.vue') },
        { path: 'product/:id', name: 'productDetail', component: () => import('../views/ProductDetailView.vue') },
        { path: 'publish', name: 'publish', component: () => import('../views/PublishView.vue') },
        { path: 'orders', name: 'orders', component: () => import('../views/OrderView.vue') },
        { path: 'profile', name: 'profile', component: () => import('../views/ProfileView.vue') }
      ]
    }
  ],
  scrollBehavior: () => ({ top: 0 })
})

export default router
