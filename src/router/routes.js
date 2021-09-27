
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { 
        path: '', component: () => import('pages/Index.vue'), 
        path: '/manage/homepage', component: () => import('pages/manage/homepage.vue'),
      },{
        path: '/subscribers', component: () => import('pages/Subscribers.vue')
      },{
        path: '/seo', component: () => import('pages/SEO.vue')
      },{
        path: '/stores', component: () => import('pages/Stores.vue')
      },{
        path: '/sitemap', component: () => import('pages/Sitemap.vue')
      },{
        path: '/blogs', component: () => import('pages/Blogs.vue')
      }
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