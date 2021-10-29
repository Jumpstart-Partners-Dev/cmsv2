<template>
  <q-page padding>
    <div class="row q-pb-md">
      <div class="col-md-12">
        <div class="text-h4">MANAGE PAGES</div>
      </div>
    </div>

    <div class="create-view" v-if="createview">
      <div class="row q-pb-md">
        <div class="col-md-8">
          <q-card>
            <q-card-section>
              <div class="text-h6">{{form_title}}</div>
            </q-card-section>

            <q-separator />

            <q-card-section>
              <div class="q-gutter-y-md">
                <q-input outlined label="Title" v-model="title" @keyup="convertToSlug"></q-input>
                <div>Canonical URL: https://www.couponsplusdeals.com/page/{{slug}}</div>
                <q-input
                  @update:model-value="val => { banner = val[0] }"
                  outlined
                  type="file"
                  hint="Banner"
                />
                <q-input outlined disable label="SEO Meta Title" v-model="title"></q-input>
                <q-input outlined label="SEO Meta Description" v-model="description"></q-input>
                <q-input outlined label="Page Text" v-model="pagetext"></q-input>

                <div class="q-gutter-sm">
                  <q-btn icon="save" :loading="savepageloading" v-if="form_type === 'create'" color="primary" label="Save" @click="savePage"></q-btn> 
                  <q-btn v-if="form_type === 'edit'" :loading="savepageloading" icon="save" color="primary" label="Edit" @click="saveEditPage"></q-btn> 
                  <q-btn label="cancel" @click="initViewAll"></q-btn>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
    
    <div class="table-view" v-if="tableview">
      <div class="row q-pb-md">
        <div class="col-md-12">
          <q-btn icon="add" color="primary" label="Create New Page" @click="initCreate"></q-btn>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12">
          <q-table
            title="Pages"
            dense
            :rows="rows"
            :columns="columns"
            row-key="name"
            :loading="tableLoader"
          >
            <template v-slot:body="props">
              <q-tr :props="props" >
                <q-td key="title" :props="props">
                  {{ props.row.title }}
                </q-td>
                <q-td key="slug" :props="props">
                  <a :href="'https://www.couponspludeals.com/page/' + props.row.slug" target="_blank">https://www.couponsplusdeals.com/page/{{ props.row.slug }}</a>
                </q-td>
                <q-td key="bing" :props="props">
                  <q-icon name="check_circle" class="text-green" style="font-size:30px"/>
                </q-td>
                <q-td key="google" :props="props">
                  <q-icon name="check_circle" class="text-green" v-if="props.row.google === 'success'" style="font-size:30px"/>
                  <q-spinner-oval color="amber" v-if="props.row.google === 'pending'" style="font-size:30px" />
                </q-td>
                <q-td key="action" :props="props">
                  <q-btn dense flat icon="visibility" color="primary" @click="view(props.row)"></q-btn>
                  <q-btn dense flat icon="edit" color="primary" @click="edit(props.row)"></q-btn>
                  <q-btn dense flat icon="delete" color="primary" @click="deletepage(props.row)"></q-btn>
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </div>
      </div>
    </div>

    <div class="create-view" v-if="pageview">
      <div class="row q-pb-md q-col-gutter-md">
        <div class="col-md-12">
          <q-card style="min-height:600px">
            <q-card-section>
              <div class="text-h6">{{form_title}}</div>
              <q-btn label="Back" icon="arrow_back" color="primary" @click="initViewAll"></q-btn>
            </q-card-section>

            <q-separator />
            <q-card-section>
              <div class="row">
                <div class="col-md-8">
                  <div class="q-pb-md">
                    <div class="text-h5">Top 4</div>
                    <div class="row">
                      <div class="col-md-3" v-for="store in this.top4" v-bind:key="store.id">
                        <div >
                          <q-img :src="store.logo" style="width:120px; height:120px; max-width: 120px; max-height: 120px;">
                            <div class="absolute-bottom text-center">{{store.code}}</div>
                          </q-img>
                          <div style="text-align: justify;overflow: hidden;text-overflow: ellipsis;white-space: nowrap; width: 120px;">{{store.name}}</div> 
                          <q-btn class="" dense icon="delete" color="red" @click="deleteTop4(store.id)" size="sm"></q-btn>
                        </div>
                      </div>
                    </div>
                    
                  </div>
                  <div class="q-pb-md">
                    <div class="text-h5">List View</div>
                    <div>
                      <q-list bordered separator dense v-for="store in this.listview" v-bind:key="store.id">
                        <q-item clickable v-ripple>
                          <q-item-section avatar>
                            <q-avatar square>
                              <img :src="store.logo">
                            </q-avatar>
                          </q-item-section>
                          <q-item-section>
                            <q-item-label>{{store.name}} - {{store.code}}</q-item-label>
                          </q-item-section>
                          <q-item-section side >
                            <q-btn class="" dense icon="delete" color="red" @click="deleteListView(store.id)" size="sm"></q-btn>
                          </q-item-section>
                        </q-item>
                      </q-list>
                    </div>
                  </div>
                </div>
                <div class="col-md-4">
                  <q-input color="purple-12" v-model.trim="searchStore" label="Search Store" @keydown.enter.prevent="search">
                    <template v-slot:prepend>
                      <q-icon name="store" />
                    </template>
                  </q-input>

                  <div class="q-pb-md" v-if="storeResultContainer" style="position:relative">
                    <q-list bordered separator dense v-show="storeResultContainer" v-for="store in this.searchStoreResults" v-bind:key="store.id">
                      <q-item clickable v-ripple @click="searchCodes(store.id)">
                        <q-item-section>
                          <q-item-label>{{store.name}}</q-item-label>
                        </q-item-section>

                        <q-item-section side top>
                          <q-badge color="green" text-color="white">Coupons: {{store.coupon_count}}</q-badge> 
                          <q-badge color="orange" text-color="black">Deals: {{store.deal_count}}</q-badge>
                        </q-item-section>
                      </q-item>
                    </q-list>

                    <q-inner-loading style="min-height: 300px;" :showing="storeResultLoader">
                      <q-spinner-oval size="50px" color="primary" />
                    </q-inner-loading>
                  </div>

                  <div class="q-pb-md" v-if="codeResultContainer" style="position:relative">
                    <div class="q-pb-md text-body1">Select code for store <b>{{selectedStoreName}}</b></div>

                    <q-list bordered separator dense 
                      v-for="code in this.searchCodeResults" v-bind:key="code.id">
                      <q-item clickable v-ripple @click="selectCode(code.id)">
                        <q-item-section>{{code.coupon_type}} - {{code.coupon_code}}</q-item-section>
                      </q-item>
                    </q-list>

                    <q-inner-loading style="min-height: 300px;" :showing="codeResultLoader">
                      <q-spinner-oval size="50px" color="primary" />
                    </q-inner-loading>
                  </div>

                  <div class="q-pb-md" v-if="confirmAddContainer" style="position:relative">
                    <div class="q-pb-md text-body1">Store <b>{{selectedStoreName}}</b></div>
                    <div class="q-pb-md text-body1">{{selectedCode.coupon_type}} <b>{{selectedCode.coupon_code}}</b></div>
                    <div class="q-pb-md text-body1">Title <b>{{selectedCode.title}}</b></div>
                    <div class="q-pb-md">
                      <q-select v-model="addSelectTarget" :options="addSelectOptions" option-value="id" option-label="desc" label="Select Target" style="max-width:300px"
                      emit-value 
                      map-options></q-select>
                    </div>
                    <div>
                      <q-btn :loading="addBtnLoading" class="q-mr-md" color="primary" label="Submit" @click="submitAdd"></q-btn>
                      <q-btn color="white" text-color="black" label="Cancel" @click="cancelAdd"></q-btn>
                    </div>
                  </div>

                </div>
              </div>
            </q-card-section>

            <q-inner-loading :showing="pageviewloader">
              <q-spinner-gears size="50px" color="primary" />
            </q-inner-loading>
          </q-card>
        </div>
      </div>
    </div>

  </q-page>
</template>

<script>
export default {
  data () {
    return {
      pageviewloader: false,
      savepageloading: false,

      addBtnLoading: false,

      addSelectTarget: '',
      addSelectOptions: [
        { id: "1", desc: "Top 4"},
        { id: "2", desc: "List Down"}
      ],

      confirmAddContainer: false,
      selectedCode: {
        coupon_type: '',
        coupon_code: '',
        title: '',
      },

      codeResultLoader: false,
      searchCodeResults: [],
      selectedStoreName: '',
      codeResultContainer: false,

      storeResultContainer: false,
      storeResultLoader: false,
      searchStore: '',
      searchStoreResults: [],

      selected_page: [],
      form_type: '',
      form_title: '___',
      title: '',
      slug: '',
      banner: null,
      description: '',
      pagetext: '',
      
      createview: false,
      pageview: false,
      tableview: true,
      tableLoader: false,
      columns: [
        {
          name: 'title',
          required: true,
          label: 'Title',
          align: 'left',
          field: row => row.title,
          sortable: true
        },
        { name: 'slug', align: 'left', label: 'Slug', field: 'slug', sortable: true },
        { name: 'action', label: '', field: 'action', sortable: true },
      ],
      rows: [
      ],

      top4: [],
      listview: []
    }
  },
  methods: {
    cancelAdd () {

    },

    hideAll () {
      this.storeResultContainer = false
      this.storeResultLoader = false
      this.codeResultContainer = false
      this.codeResultLoader = false
      this.confirmAddContainer = false
      this.searchStoreResults = []
      this.searchCodeResults = []
    },

    submitAdd () {
      var type = this.addSelectTarget

      this.addBtnLoading = true
      this.pageviewloader = true

      this.$api.post('/page/content/create', {
        type: type,
        page_id: this.selected_page.id,
        store_id: this.selectedStoreId,
        coupon_id: this.selectedCode.id,
      })
        .then(response => {
          this.pageviewloader = false
          this.addBtnLoading = false
          this.searchStore = ''
          this.hideAll()
          if(type === '1') {
            this.loadTop4()
          } else if(type === '2') {
            this.loadList()
          }
        })
    },

    loadTop4() {
      this.pageviewloader = true
      this.$api.get('/page/content/'+this.selected_page.id+'/1', {

      })
        .then(response => {
          this.top4 = response.data.data
          this.pageviewloader = false
        })
    },
    
    loadList() {
      this.pageviewloader = true
      this.$api.get('/page/content/'+this.selected_page.id+'/2', {

      })
        .then(response => {
          this.listview = response.data.data
          this.pageviewloader = false
        })
    },

    search () {
      //this.hideAll()
      this.searchStoreResults = [];
      this.storeResultContainer = true;
      this.storeResultLoader = true

      this.$api.post('/manage/searchStores', {
        search: this.searchStore
      })
        .then(response => {
          if (response.data.status === 0) {
            this.searchStoreResults = response.data.data
            this.storeResultLoader = false
          }
        })
    },
    searchCodes (id) {
      this.selectedStoreId = id
      var s = this.searchStoreResults.filter(x => x.id == id)[0]
      this.selectedStoreName = s.name

      this.storeResultContainer = false
      this.codeResultContainer = true
      this.codeResultLoader = true

      this.$api.post('/manage/searchCodes', {
        store_id: this.selectedStoreId
      })
        .then(response => {
          if (response.data.status === 0) {
            this.searchCodeResults = response.data.data
            this.codeResultLoader = false
          }
        })
    },

    selectCode (id) {
      this.selectedCodeId = id
      var s = this.searchCodeResults.filter(x => x.id == id)[0]
      this.selectedCode = s

      this.codeResultContainer = false
      this.confirmAddContainer = true
    },

    deleteTop4(id) {
      this.pageviewloader = true
      this.$api.post('/page/content/delete/'+id)
        .then(response => {
          this.loadTop4()
        })
    },

    deleteListView(id) {
      this.pageviewloader = true
      this.$api.post('/page/content/delete/'+id)
        .then(response => {
          this.loadList()
        })
    },

    initCreate() {
      this.createview = true
      this.tableview = false
      this.form_title = "Create New Page"
      this.title = ''
      this.slug = ''
      this.description = ''
      this.banner = null
      this.pagetext = ''
      this.form_type = 'create'
    },

    initEdit(page) {
      this.createview = true
      this.tableview = false
      this.form_title = "Edit Page - " + page.title
      this.title = page.title
      this.slug = page.slug
      this.banner = null
      this.description = page.description
      this.form_type = 'edit'
      this.pagetext = page.pagetext

      this.selected_page = page
    },
    
    initPage(page) {
      this.form_title = "View Page - " + page.title
      this.top4 = []
      this.listview = []

      this.selected_page = page

      this.pageview = true,
      this.tableview = false,

      this.loadTop4()
      this.loadList()
    },

    initViewAll () {
      this.createview = false
      this.tableview = true
      this.pageview = false
    },

    savePage() {
      this.savepageloading = true

      const fileData = new FormData()
      fileData.append('title', this.title)
      fileData.append('slug', this.slug)
      fileData.append('banner', this.banner)
      fileData.append('description', this.description)
      fileData.append('pagetext', this.pagetext)
      this.$api.post('/page/create', fileData,{
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
        .then(response => {
          this.savepageloading = false
          this.initViewAll()
          this.loadTable()
      })
    },

    saveEditPage () {
      this.savepageloading = true

      const fileData = new FormData()
      fileData.append('title', this.title)
      fileData.append('slug', this.slug)
      fileData.append('banner', this.banner)
      fileData.append('description', this.description)
      fileData.append('pagetext', this.pagetext)
      this.$api.post('/page/update/' + this.selected_page.id, fileData,{
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
        .then(response => {
          this.savepageloading = false
          this.initViewAll()
          this.loadTable()
      })
    },

    convertToSlug() {
      var Text = this.title
      this.slug = Text
                .toLowerCase()
                .replace(/[^\w ]+/g, '')
                .replace(/ +/g, '-');
    },
    view (page) {
      this.initPage(page)
    },
    edit (page) {
      this.initEdit(page)
    },
    deletepage (page) {
      this.tableLoader = true
      this.$api.post('/page/delete/' + page.id, {})
        .then(response => {
          this.tableLoader = false
          this.loadTable()
        })
    },
    create () {

    },
    loadTable () {
      this.rows = []
      this.tableLoader = true
      this.$api.get('/page/index', {})
        .then(response => {
          this.rows = response.data.data
          this.tableLoader = false
        })
    }
  },
  created () {
    this.loadTable()
  }
}
</script>
