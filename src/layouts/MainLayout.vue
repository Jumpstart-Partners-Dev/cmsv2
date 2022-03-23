<template>
  <q-layout view="hHh lpR fFf" class="bg-grey-1">
    <q-header elevated class="bg-white text-grey-8 q-py-xs" height-hint="58">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          @click="toggleLeftDrawer"
          aria-label="Menu"
          icon="menu"
        />

        <q-btn flat no-caps no-wrap class="q-ml-xs" v-if="$q.screen.gt.xs">
          <q-toolbar-title shrink class="text-weight-bold">
            COUPONS PLUS DEALS
          </q-toolbar-title>
        </q-btn>

        <q-space />

        <div class="YL__toolbar-input-container row no-wrap">
          <q-input dense outlined square v-model="search" placeholder="Search" class="bg-white col" />
          <q-btn class="YL__toolbar-input-btn" color="grey-3" text-color="grey-8" icon="search" unelevated />
        </div>

        <q-space />

        <div class="q-gutter-sm row items-center no-wrap">
          <q-btn round dense flat color="grey-8" icon="apps" v-if="$q.screen.gt.sm">
            <q-tooltip>Apps</q-tooltip>
          </q-btn>
          <q-btn round dense flat color="grey-8" icon="message" v-if="$q.screen.gt.sm">
            <q-tooltip>Messages</q-tooltip>
          </q-btn>
          <q-btn round dense flat color="grey-8" icon="notifications">
            <q-badge color="red" text-color="white" floating>
              2
            </q-badge>
            <q-tooltip>Notifications</q-tooltip>
          </q-btn>
          <q-btn round flat>
            <q-avatar size="26px">
              <img src="https://cdn.quasar.dev/img/boy-avatar.png">
            </q-avatar>
            <q-tooltip>Account</q-tooltip>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class="bg-grey-2"
      :width="240"
    >
      <q-scroll-area class="fit">
        <q-list padding>
          <q-item v-for="link in links1" tag="a" :href="link.link" :key="link.text" v-ripple clickable>
            <q-item-section avatar>
              <q-icon color="grey" :name="link.icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ link.text }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator class="q-my-md" />

          <q-item v-for="link in links2" tag="a" :href="link.link" :key="link.text" v-ripple clickable>
            <q-item-section avatar>
              <q-icon color="grey" :name="link.icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ link.text }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator class="q-mt-md q-mb-xs" />

          <q-item-label header class="text-weight-bold text-uppercase">
            Manage
          </q-item-label>

          <q-item v-for="link in links3" tag="a" :href="link.link" :key="link.text" v-ripple clickable>
            <q-item-section avatar>
              <q-icon color="grey" :name="link.icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ link.text }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator class="q-my-md" />

          <q-item-label header class="text-weight-bold text-uppercase">
            Admin
          </q-item-label>

          <q-item v-for="link in links4" tag="a" :href="link.link" :key="link.text" v-ripple clickable>
            <q-item-section avatar>
              <q-icon color="grey" :name="link.icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ link.text }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator class="q-my-md" />

          <q-item v-for="link in links5" tag="a" :href="link.link" :key="link.text" v-ripple clickable>
            <q-item-section avatar>
              <q-icon color="grey" :name="link.icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ link.text }}</q-item-label>
            </q-item-section>
          </q-item>

        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref } from 'vue'
import { fabYoutube } from '@quasar/extras/fontawesome-v5'
import { useQuasar } from 'quasar'
export default {
  name: 'MyLayout',
  setup () {
    const $q = useQuasar()
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
  },
  created () {
    if(!this.$q.localStorage.has('user')) {
      this.$router.push('/login')
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
