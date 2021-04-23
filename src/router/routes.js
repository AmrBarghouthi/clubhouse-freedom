const routes = [
  {
    path: '/hallway',
    name: 'index',
    component: () => import('pages/Index.vue'),
  },
  {
    path: '/',
    redirect: { name: 'index' },
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: 'room/:roomCode',
        name: 'room',
        component: () => import('pages/Room.vue'),
      },
      {
        path: 'profile/:userId?',
        name: 'profile',
        component: () => import('pages/Profile'),
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
      {
        path: 'blocked',
        name: 'auth.blocked',
        component: () => import('pages/Auth/Blocked'),
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
