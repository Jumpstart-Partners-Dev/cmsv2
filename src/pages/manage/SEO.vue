<template>
  <q-page padding>
    <div class="row">
      <div class="text-h4">SEO</div>
    </div>
    <div class="row q-col-gutter-md">
      <div class="col-md-6">
        <div class="q-pb-md">
          <q-select :options="searchoption" v-model="searchselect" style="width:120px" class="float-left"
            option-value="id"
            option-label="desc"
            emit-value
            map-options
            outlined></q-select>
          <q-input outlined v-model="searchKey" style="width:300px" label="Type then press Enter" @keydown.enter.prevent="search" :loading="searchLoading"></q-input>
        </div>
        <q-list bordered separator v-show="searchResultContainer" v-for="store in this.searchResults" v-bind:key="store.id">
          <q-item clickable v-ripple @click="select(store)">
            <q-item-section>
              <q-item-label>{{store.name}}</q-item-label>
              <q-item-label v-if="searchselect === 'store'" style="font-size:12px">https://www.couponsplusdeals.com/{{store.alias}}-coupons</q-item-label>
              <q-item-label v-if="searchselect === 'blog'" style="font-size:12px">https://www.couponsplusdeals.com/blog/{{store.alias}}</q-item-label>
            </q-item-section>

            <q-item-section side top>
              <q-img :src="store.logo" style="width:30px;height:30px"></q-img>
            </q-item-section>
          </q-item>
        </q-list>
        <div v-show="selectResultContainer">
          <div class="row q-col-gutter-md">
            <div class="col-md-2">
              <q-img :src="selectedStore.logo"></q-img>
            </div>
            <div class="col-md-10">
              <div class="q-pb-md q-pt-md text-h5 text-bold">{{selectedStore.name}}</div>
              <div v-if="searchselect === 'store'" class="q-pb-md">Canonical URL: https://www.couponsplusdeals.com/{{selectedStore.alias}}-coupons</div>
              <div v-if="searchselect === 'blog'" class="q-pb-md">Canonical URL: https://www.couponsplusdeals.com/blog/{{selectedStore.alias}}</div>
              <div class="q-mb-md">
                <div>
                  <q-input outlined v-model="title" style="width:500px" label="Meta Title" :loading="entryLoading"></q-input>
                </div>
                <div>
                  <q-input outlined type="textarea" v-model="description" style="width:500px" label="Meta Description" :loading="entryLoading"></q-input>
                </div>
              </div>
              <div class="">
                <q-btn color="primary" @click="save" :loading="saveloading">Save</q-btn> <span v-if="successtext" class="text-green">Success</span>
              </div>
            </div>
          </div>
          
        </div>
      </div>
      <div class="col-md-6">
        <div class="text-h5">Static Pages</div>
        <div>
          <q-list bordered separator>
            <q-item clickable v-ripple>
              <q-item-section>
                <q-item-label>Homepage</q-item-label>
                <q-item-label caption>https://www.counponsplusdeals.com/</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple>
              <q-item-section>
                <q-item-label overline>Terms</q-item-label>
                <q-item-label caption>https://www.counponsplusdeals.com/Terms</q-item-label>
              </q-item-section>
            </q-item>
            
            <q-item clickable v-ripple>
              <q-item-section>
                <q-item-label overline>Privacy</q-item-label>
                <q-item-label caption>https://www.counponsplusdeals.com/Privacy-Policy</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  data () {
    return {
      searchKey: '',
      searchLoading: false,
      searchselect: 'store',
      searchoption: [
        { id: 'store', desc: 'Stores' },
        { id: 'blog', desc: 'Blogs' }
      ],
      searchResultContainer: true,
      searchResults: [],
      selectResultContainer: false,
      selectedStore: {
        name: '',
        logo: '',
        alias: ''
      },
      title: '',
      description: '',
      entryLoading: false,
      details: [],
      saveloading: false,
      successtext: false,
    }
  },
  methods: {
    search () {
      this.successtext = false
      this.searchLoading = true
      this.searchResultContainer = false
      this.selectResultContainer = false
      this.title = ''
      this.description = ''

      if(this.searchselect === 'store') {
        this.$api.post('/manage/searchStores', {
          search: this.searchKey
        })
          .then(response => {
            if (response.data.status === 0) {
              this.searchResults = response.data.data
              this.searchLoading = false
              this.searchResultContainer = true
            }
          })
      } else {
        this.$api.post('/manage/searchBlogs', {
          search: this.searchKey
        })
          .then(response => {
            if (response.data.status === 0) {
              this.searchResults = response.data.data
              this.searchLoading = false
              this.searchResultContainer = true
            }
          })
      }
      
    },
    select (store) {
      this.selectedStore = store
      this.searchResultContainer = false
      this.selectResultContainer = true

      this.entryLoading = true
      this.details = []

      this.$api.post('/manage/getSeoDetails', {
        id: this.selectedStore.id,
        type: this.searchselect
      })
        .then(response => {
          if (response.data.status === 0) {
            this.details = response.data.data
            for(var x in this.details) {
              this.title = this.details[x].title
              this.description = this.details[x].description
            }
            this.entryLoading = false
          }
        })
    },
    save () {
      this.saveloading = true
      this.successtext = false

      this.$api.post('/manage/saveSeoDetails', {
        id: this.selectedStore.id,
        type: this.searchselect,
        title: this.title,
        description: this.description
      })
        .then(response => {
          if (response.data.status === 0) {
            this.details = response.data.data
            this.saveloading = false
            this.successtext = true
          }
        })
    }
  }
}
</script>
