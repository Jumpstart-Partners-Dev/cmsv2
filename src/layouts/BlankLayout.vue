<template>
  <q-layout view="hHh lpR fFf" class="bg-grey-5">
    
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref } from 'vue'
import { fabYoutube } from '@quasar/extras/fontawesome-v5'
export default {
  name: 'MyLayout',
  setup () {
    const leftDrawerOpen = ref(false)
    const search = ref('')
    function toggleLeftDrawer () {
      leftDrawerOpen.value = !leftDrawerOpen.value
    }
    return {
      fabYoutube,
      leftDrawerOpen,
      search,
      toggleLeftDrawer,
      links1: [
        { icon: 'dashboard', text: 'Dashboard', link: '/dashboard' },
        { icon: 'update', text: 'Updates', link: '/updates' },
      ],
      links2: [
        { icon: 'store', text: 'Stores', link: '/stores' },
        { icon: 'article', text: 'Blogs', link: '/articles' },
        { icon: 'web', text: 'Custom Page', link: '/pages' },
      ],
      links3: [
        { icon: 'home', text: 'Homepage', link: '/manage/homepage' },
        { icon: 'view_list', text: 'Sitemap', link: '/manage/sitemap' },
        { icon: 'loyalty', text: 'Subscribers', link: '/manage/subscribers' },
        { icon: 'search', text: 'SEO', link: '/manage/seo'}
      ],
      links4: [
        { icon: 'people', text: 'Users', link: '/admin/users'},
        { icon: 'lock', text: 'Site Controls', link: '/admin/site'}
      ],
      links5: [
        { icon: 'settings', text: 'Account Settings' }
      ]
    }
  }
}

// import EssentialLink from 'components/EssentialLink.vue'

// const linksList = [
//   {
//     title: 'Dashboard',
//     caption: '',
//     icon: 'dashboard',
//     link: '/'
//   },
//   {
//     title: 'Stores',
//     caption: '',
//     icon: 'store',
//     link: '/#/stores'
//   },
//   {
//     title: 'Blogs',
//     caption: '',
//     icon: 'article',
//     link: '/#/blogs'
//   },
//   {
//     title: 'Manage Homepage',
//     caption: '',
//     icon: 'home',
//     link: '/#/manage/homepage'
//   },
//   {
//     title: 'Subscribers',
//     caption: '',
//     icon: 'mail',
//     link: '/#/subscribers'
//   },
//   {
//     title: 'SEO',
//     caption: '',
//     icon: 'search',
//     link: '/#/seo'
//   },
//   {
//     title: 'Pages',
//     caption: '',
//     icon: 'link',
//     link: '/#/pages'
//   },
//   {
//     title: 'Sitemap Manager',
//     caption: '',
//     icon: 'web',
//     link: '/#/sitemap'
//   },
//   {
//     title: 'Admin',
//     caption: '',
//     icon: 'settings',
//     link: '/#/admin'
//   },
// ];

// import { defineComponent, ref } from 'vue'

// export default defineComponent({
//   name: 'MainLayout',

//   components: {
    
//   },

//   setup () {
//     const leftDrawerOpen = ref(false)

//     return {
//       essentialLinks: linksList,
//       leftDrawerOpen,
//       toggleLeftDrawer () {
//         leftDrawerOpen.value = !leftDrawerOpen.value
//       }
//     }
//   }
// })
</script>

<style lang="sass">
.YL
  &__toolbar-input-container
    min-width: 100px
    width: 55%
  &__toolbar-input-btn
    border-radius: 0
    border-style: solid
    border-width: 1px 1px 1px 0
    border-color: rgba(0,0,0,.24)
    max-width: 60px
    width: 100%
  &__drawer-footer-link
    color: inherit
    text-decoration: none
    font-weight: 500
    font-size: .75rem
    &:hover
      color: #000
</style>
