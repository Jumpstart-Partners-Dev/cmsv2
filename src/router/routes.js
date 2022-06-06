
const routes = [
  {
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/' , component: () => import('pages/Index.vue'), },
      { path: '/dashboard', component: () => import('pages/Index.vue'), },
      { path: '/manage/homepage', component: () => import('pages/manage/homepage.vue'), },
      { path: '/manage/subscribers', component: () => import('pages/manage/Subscribers.vue'), },
      { path: '/manage/seo', component: () => import('pages/manage/SEO.vue'), },
      { path: '/stores', component: () => import('pages/Stores.vue'), },
      { path: '/manage/sitemap', component: () => import('pages/manage/Sitemap.vue'), },
      { path: '/stores/commissions', component: () => import('pages/Stores/viewCommissions.vue'), },
      { path: '/admin/users', component: () => import('pages/admin/users.vue')},
      { path: '/admin/users/permissions/:id', component: () => import('pages/admin/userPermission.vue')},
      { path: '/blogs', component: () => import('pages/Blogs.vue'), },
      { path: '/store/:id', component: () => import('pages/Stores/viewStore.vue') }
    ]
  },
  {
    component: () => import('layouts/BlankLayout.vue'),
    children: [
      { path: '/login', component: () => import('pages/Login.vue')}
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
