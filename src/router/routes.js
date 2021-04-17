import store from 'src/store'


const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    beforeEnter: (to, from, next) => {
      const signUpStage = store.getters['auth/signUpStage']
      if (signUpStage !== 'COMPLETED') {
        next({ name: 'auth.login' })
      }
      next()
    },
    children: [
      {
        path: '',
        name: 'index',
        component: () => import('pages/Index.vue'),
      },
      {
        path: 'room/:roomCode',
        name: 'room',
        component: () => import('pages/Room.vue'),
      },
    ],
  },
  {
    path: '/auth',
    component: () => import('layouts/AuthLayout'),
    children: [
      {
        path: 'login',
        name: 'auth.login',
        component: () => import('pages/Auth/Login'),
      },
      {
        path: 'onboarding',
        name: 'auth.onboarding',
        component: () => import('pages/Auth/Onboarding'),
      },
      {
        path: 'waitlisted',
        name: 'auth.waitlisted',
        component: () => import('pages/Auth/Waitlisted'),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue'),
  },
]

export default routes
