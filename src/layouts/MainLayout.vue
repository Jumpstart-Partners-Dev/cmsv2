<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          www.couponsplusdeals.com
        </q-toolbar-title>

        <div>Content Management v.1.0.1</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class="bg-grey-1"
    >
      <q-list>
        <q-item-label
          header
          class="text-grey-8"
        >
          Menu
        </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import EssentialLink from 'components/EssentialLink.vue'

const linksList = [
  {
    title: 'Dashboard',
    caption: '',
    icon: 'dashboard',
    link: '/'
  },
  {
    title: 'Stores',
    caption: '',
    icon: 'store',
    link: '/#/stores'
  },
  {
    title: 'Blogs',
    caption: '',
    icon: 'article',
    link: '/#/blogs'
  },
  {
    title: 'Manage Homepage',
    caption: '',
    icon: 'home',
    link: '/#/manage/homepage'
  },
  {
    title: 'Subscribers',
    caption: '',
    icon: 'mail',
    link: '/#/subscribers'
  },
  {
    title: 'SEO',
    caption: '',
    icon: 'search',
    link: '/#/seo'
  },
  {
    title: 'Sitemap Manager',
    caption: '',
    icon: 'web',
    link: '/#/sitemap'
  },
  {
    title: 'Admin',
    caption: '',
    icon: 'settings',
    link: '/#/admin'
  },
];

import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink
  },

  setup () {
    const leftDrawerOpen = ref(false)

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  }
})
</script>
