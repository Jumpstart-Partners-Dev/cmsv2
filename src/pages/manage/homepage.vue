<template>
  <q-page padding>
    <div class="q-pa-md">
      <div class="row">
        <div class="row q-pb-md">
          <div class="col-md-12">
            <div class="text-h4">MANAGE HOMEPAGE</div>
          </div>
        </div>
      </div>
      
      <div class="row q-col-gutter-md q-pb-md">
        <div class="col-md-6">
          <div class="text-h6 q-pb-md">BEST STORES - Slider</div>
          
          <div class="q-pb-md">
            <q-markup-table id="best-store-table">
              <thead> 
                <tr>
                  <th></th>
                  <th class="text-left">Store Name</th>
                  <th class="text-right">
                  <q-btn color="primary" label="Reorder" size="sm" v-if="toggleBestStore == false" @click="reorderBestStore"></q-btn>
                  <q-btn class="q-mr-xs" :loading="saveBestStoreReorder" color="accent" label="Save" size="sm" v-if="toggleBestStore == true" @click="bestStoreReorder"></q-btn>
                  <q-btn label="Cancel" size="sm" v-if="toggleBestStore == true" @click="cancelbestStoreReorder"></q-btn>
                </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="store in this.bestStores" v-bind:key="store.id" :loading="true" >
                  <td class="text-left"><q-img :src="store.logo" sizes=""></q-img></td>
                  <td class="text-left">{{store.name}}</td>
                  <td class="text-right"> 
                    <q-btn dense class="q-mr-sm" size="sm" icon="delete" color="negative" label="" v-if="toggleBestStore == false" @click="deleteBestStoreBtn(store.id, store.name)" />
                  <q-btn dense class="q-mr-sm" flat size="sm" icon="keyboard_arrow_up" color="primary" label="" v-if="toggleBestStore" @click="moveUp('beststore',store.id)" />
                  <q-btn dense flat size="sm" icon="keyboard_arrow_down" color="primary" label="" v-if="toggleBestStore" @click="moveDown('beststore', store.id)" />
                  </td>
                </tr>
                <tr class="text-center" v-if="bestStoreLoading" style="height:500px">
                  <td colspan="3"><q-spinner size="50px" color="primary" /></td>
                </tr>
              </tbody>
            </q-markup-table>
          </div>

          <div class="text-h6 q-pb-md">TOP STORES</div>
          
          <q-markup-table id="top-store-table">
            <thead> 
              <tr>
                <th></th>
                <th class="text-left">Store Name</th>
                <th class="text-right">
                  <q-btn color="primary" label="Reorder" size="sm" v-if="toggleTopStore == false" @click="reorderTopStore"></q-btn>
                  <q-btn class="q-mr-xs" :loading="saveTopStoreReorder" color="accent" label="Save" size="sm" v-if="toggleTopStore == true" @click="topStoreReorder"></q-btn>
                  <q-btn label="Cancel" size="sm" v-if="toggleTopStore == true" @click="canceltopStoreReorder"></q-btn>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="store in this.topStores" v-bind:key="store.id">
                <td class="text-left"><q-img :src="store.logo"></q-img></td>
                <td class="text-left">{{store.name}}</td>
                <td class="text-right">
                  <q-btn dense class="q-mr-sm" size="sm" icon="delete" color="negative" label="" v-if="toggleTopStore == false" @click="deleteTopStoreBtn(store.id, store.name)" />
                  <q-btn dense class="q-mr-sm" flat size="sm" icon="keyboard_arrow_up" color="primary" label="" v-if="toggleTopStore" @click="moveUp('topstore',store.id)" />
                  <q-btn dense flat size="sm" icon="keyboard_arrow_down" color="primary" label="" v-if="toggleTopStore" @click="moveDown('topstore', store.id)" /> 
                </td>
              </tr>
              <tr class="text-center" v-if="topStoreLoading" style="height:500px">
                <td colspan="3"><q-spinner size="50px" color="primary" /></td>
              </tr>
            </tbody>
          </q-markup-table>
        </div>

        <q-dialog v-model="topStoreDeleteConfirm" persistent>
          <q-card>
            <q-card-section class="row items-center">
              <q-avatar size="sm" icon="delete" color="red" text-color="white" />
              <span class="q-ml-sm">Are you sure to delete '{{topStoreDeleteStoreName}}'</span>
            </q-card-section>

            <q-card-actions align="right">
              <q-btn size="sm" label="cancel" color="primary" v-close-popup />
              <q-btn :loading="topStoreDeleteLoading" size="sm" label="Yes, Delete" color="red" text-color="white" @click="confirmDeleteTopStore()" />
            </q-card-actions>
          </q-card>
        </q-dialog>

        <q-dialog v-model="bestStoreDeleteConfirm" persistent>
          <q-card>
            <q-card-section class="row items-center">
              <q-avatar size="sm" icon="delete" color="red" text-color="white" />
              <span class="q-ml-sm">Are you sure to delete '{{bestStoreDeleteStoreName}}'</span>
            </q-card-section>

            <q-card-actions align="right">
              <q-btn size="sm" label="cancel" color="primary" v-close-popup />
              <q-btn :loading="bestStoreDeleteLoading" size="sm" label="Yes, Delete" color="red" text-color="white" @click="confirmDeleteBestStore()" />
            </q-card-actions>
          </q-card>
        </q-dialog>

        <div class="col-md-6">
          <div class="q-pb-md">
            <q-input color="purple-12" v-model.trim="searchStore" label="Search Store" @keydown.enter.prevent="search">
              <template v-slot:prepend>
                <q-icon name="store" />
              </template>
            </q-input>
          </div>

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
    </div>
  </q-page>
</template>

<script>
export default {
  // name: 'PageName',
  data () {
    return {
      addSelectTarget: '',
      addSelectOptions: [
        { id: "best_stores", desc: "Best Store"},
        { id: "top_stores", desc: "Top Store"},
        { id: "popular_stores", desc: "Popular Store"}
      ],

      topStores: [],
      toggleTopStore: false,
      topStoreLoading: false,
      topStoreDeleteConfirm: false,
      topStoreDeleteStoreName: '',
      topStoreForDelete: 0,
      topStoreDeleteLoading: false,
      saveTopStoreReorder: false,

      bestStores: [],
      toggleBestStore: false,
      bestStoreLoading: false,
      bestStoreDeleteConfirm: false,
      bestStoreDeleteStoreName: '',
      bestStoreForDelete: 0,
      bestStoreDeleteLoading: false,
      saveBestStoreReorder: false,

      popularStores: [],
      togglepPopularStore: false,
      popularStoreLoading: false,

      searchStore: '',

      searchStoreResults: [],
      selectedStoreId: 0,
      selectedStoreName: '',
      searchCodeResults: [],
      selectedCodeId: 0,
      selectedCode: {title: '', coupon_type: '', coupon_code: ''},

      storeResultContainer: false,
      storeResultLoader: false,
      codeResultContainer: false,
      codeResultLoader: false,
      confirmAddContainer: false,

      addBtnLoading: false,

      backup: []
    }
  },
  methods: {
    confirmDeleteTopStore () {
      console.log(this.topStoreForDelete)
      this.topStoreDeleteLoading = true
      this.$api.post('/manage/removeStore', {
        target: 'top_stores',
        store_id: this.topStoreForDelete
      })
        .then(response => {
          this.topStores = this.topStores.filter(e => e.id !== this.topStoreForDelete)
          this.topStoreDeleteLoading = false
          this.topStoreDeleteConfirm = false
        });
    },

    deleteTopStoreBtn (id, name) {
      this.topStoreDeleteConfirm = true
      this.topStoreDeleteStoreName = name
      this.topStoreForDelete = id
    },

    reorderTopStore () {
      this.toggleTopStore = true
      this.backup = this.topStores
    },

    topStoreReorder () {
      //reorder save
      this.saveTopStoreReorder = true
      this.$api.post('/manage/reorder', {
        target: 'top_stores',
        stores: JSON.stringify(this.topStores)
      })
        .then(response => {
          this.saveTopStoreReorder = false
          this.toggleTopStore = false
        })
        .catch((error) => {
          console.log(error);
          this.notifyError(error)
          this.saveTopStoreReorder = false
        });
    },

    canceltopStoreReorder () {
      this.toggleTopStore = false
      this.topStores = this.backup
    },

    // ---- best

    confirmDeleteBestStore () {
      console.log(this.bestStoreForDelete)
      this.bestStoreDeleteLoading = true
      this.$api.post('/manage/removeStore', {
        target: 'best_stores',
        store_id: this.bestStoreForDelete
      })
        .then(response => {
          this.bestStores = this.bestStores.filter(e => e.id !== this.bestStoreForDelete)
          this.bestStoreDeleteLoading = false
          this.bestStoreDeleteConfirm = false
        });
    },

    deleteBestStoreBtn (id, name) {
      this.bestStoreDeleteConfirm = true
      this.bestStoreDeleteStoreName = name
      this.bestStoreForDelete = id
    },

    reorderBestStore () {
      this.toggleBestStore = true
      this.backup = this.bestStores
    },

    bestStoreReorder () {
      //reorder save
      this.saveBestStoreReorder = true
      this.$api.post('/manage/reorder', {
        target: 'best_stores',
        stores: JSON.stringify(this.bestStores)
      })
        .then(response => {
          this.saveBestStoreReorder = false
          this.toggleBestStore = false
        })
        .catch((error) => {
          console.log(error);
          this.notifyError(error)
          this.saveBestStoreReorder = false
        });
    },

    cancelbestStoreReorder () {
      this.toggleBestStore = false
      //this.bestStores = this.backup
    },




    // -- end best

    submitAdd () {
      var target = this.addSelectTarget

      this.addBtnLoading = true

      this.$api.post('/manage/addStore', {
        target: target,
        store_id: this.selectedStoreId,
        coupon_id: this.selectedCode.id
      })
        .then(response => {
          this.addBtnLoading = false
          this.searchStore = ''
          this.hideAll()
          if(target === 'top_stores') {
            this.loadTopStore(1)
          } else if(target === 'best_stores') {
            this.loadBestStore(1)
          }
        })
    },
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
    search () {
      this.hideAll()
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

    arraymove (arr, fromIndex, toIndex) {
      var element = arr[fromIndex];
      arr.splice(fromIndex, 1);
      arr.splice(toIndex, 0, element);
    },
    moveUp (list, id) {
      var arr = [];
      if(list === "topstore") {
        arr = this.topStores
      } else if (list === "beststore") {
        arr = this.bestStores
      } else if (list === "popularstore") {
        arr = this.popularStores
      }
      
      var idx = 0;
      for (var x in arr) {
        if (arr[x].id === id) {
          idx = x;
          break;
        }
      }
      
      if(idx === "0") {
        return 0;
      } else{
        this.arraymove(arr, idx, parseInt(idx) - 1);
      }

      if(list === "topstore") {
        this.topStores = arr
      } else if (list === "beststore") {
        this.bestStores = arr
      } else if (list === "popularstore") {
        this.popularStores = arr
      }
    },

    moveDown (list, id) {
      var arr = [];
      if(list === "topstore") {
        arr = this.topStores
      } else if (list === "beststore") {
        arr = this.bestStores
      } else if (list === "popularstore") {
        arr = this.popularStores
      }
      
      var idx = 0;
      for (var x in arr) {
        if (arr[x].id === id) {
          idx = x;
          break;
        }
      }
      
      if(idx == arr.length) {
        return 0;
      } else{
        this.arraymove(arr, idx, parseInt(idx) + 1);
      }

      if(list === "topstore") {
        this.topStores = arr
      } else if (list === "beststore") {
        this.bestStores = arr
      } else if (list === "popularstore") {
        this.popularStores = arr
      }
    },

    loadTopStore (focus = 0) {
      this.topStoreLoading = true
      this.topStores = []
      this.$api.get('/manage/getTopStores', {
      })
        .then(response => {
          if (response.data.status === 0) {
            this.topStores = response.data.data
            this.topStoreLoading = false
            if(focus == 1) {
              document.getElementById('top-store-table').scrollIntoView(false)
            }
          }
        })
    },

    loadBestStore (focus = 0) {
      this.bestStoreLoading = true
      this.bestStores = []
      this.$api.get('/manage/getBestStores', {
      })
        .then(response => {
          if (response.data.status === 0) {
            this.bestStores = response.data.data
            this.bestStoreLoading = false
            if(focus == 1) {
              document.getElementById('best-store-table').scrollIntoView(false)
            }
          }
        })
    },

    notifyError (message) {
      this.$q.notify({
        type: 'negative',
        message: "Oops! ERROR " + message,
        position: 'top',
        timeout: 5000
      })
    },

    preload () {
      this.loadBestStore()
      this.loadTopStore()
    }
  },
  created () {
    this.preload()
  }
}
</script>
