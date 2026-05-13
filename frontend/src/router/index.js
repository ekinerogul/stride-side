import { createRouter, createWebHistory } from 'vue-router'
import store from '../store'
import Athletes from '../views/Athletes.vue'
import Athlete from '../views/Athlete.vue'
import Guides from '../views/Guides.vue'
import Guide from '../views/Guide.vue'
import Sessions from '../views/Sessions.vue'
import Session from '../views/Session.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import DashboardView from '../views/DashboardView.vue'

const routes = [
  {
    path: '/',
    redirect: '/sessions'
  },
  {
    path: '/sessions',
    name: 'Sessions',
    component: Sessions,
    meta: { requiresAuth: true }
  },
  {
    path: '/sessions/:sessionId',
    name: 'Session',
    component: Session,
    meta: { requiresAuth: true }
  },
  {
    path: '/athletes',
    name: 'Athletes',
    component: Athletes,
    meta: { requiresAuth: true }
  },
  {
    path: '/athletes/:athleteId',
    name: 'Athlete',
    component: Athlete,
    meta: { requiresAuth: true }
  },
  {
    path: '/guides',
    name: 'Guides',
    component: Guides,
    meta: { requiresAuth: true }
  },
  {
    path: '/guides/:guideId',
    name: 'Guide',
    component: Guide,
    meta: { requiresAuth: true }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !store.state.token) {
    next('/login')
  } else {
    next()
  }
})

export default router
