<template>
  <q-page padding>
    <div class="row q-pb-md">
      <div class="col-md-12">
        <q-card>
          <q-card-section>
            <div class="items-center">
              <div class="q-gutter-md row">
                <div class="col-md-2">
                  <div style="">
                    <q-select filled dense emit-value map-options
                      v-model="commissions.header.login_ok.model"
                      :options="commissions.header.login_ok.options"
                      label="Logins" color="teal" options-selected-class="text-deep-orange"
                    >
                      <template v-slot:option="scope">
                        <q-item v-bind="scope.itemProps">
                          <q-item-section avatar>
                            <q-icon :color="scope.opt.color" class="text-white" :name="scope.opt.icon" />
                          </q-item-section>
                          <q-item-section>
                            <q-item-label>{{ scope.opt.label }}</q-item-label>
                          </q-item-section>
                        </q-item>
                      </template>
                    </q-select>
                  </div>
                </div>

                <div class="col-md-2">
                  <div style="">
                    <q-select filled dense emit-value map-options
                      v-model="commissions.header.settings_ok.model"
                      :options="commissions.header.settings_ok.options"
                      label="Auto Fetch" color="teal" options-selected-class="text-deep-orange"
                    >
                      <template v-slot:option="scope">
                        <q-item v-bind="scope.itemProps">
                          <q-item-section avatar>
                            <q-icon :color="scope.opt.color" class="text-white" :name="scope.opt.icon" />
                          </q-item-section>
                          <q-item-section>
                            <q-item-label>{{ scope.opt.label }}</q-item-label>
                          </q-item-section>
                        </q-item>
                      </template>
                    </q-select>
                  </div>
                </div>

                <div class="col-md-2">
                  <q-btn label="Filter" @click="getAll" ></q-btn>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <div class="row q-col-gutter-md">
      <div class="col-md-6">
        <q-card>
          <q-card-section>
            <q-table dense
              row-key="name" v-model:pagination="commissions.table.pagination"
              :rows="commissions.table.rows"
              :columns="commissions.table.columns"
              :filter="commissions.table.filter"
              :loading="commissions.table.loading"
            >
              <template v-slot:top>
                <q-btn color="primary" icon="add" dense size="sm" />
                <q-space />
                <q-input outlined dense debounce="300" 
                  label="Search" color="primary" v-model="commissions.table.filter"
                  @keydown.enter.prevent="getAll"
                  >
                  <template v-if="commissions.table.filter" v-slot:append>
                    <q-icon name="cancel" @click.stop="clearFilter(false)" class="cursor-pointer" />
                  </template>
                </q-input>
              </template>

              <template v-slot:body="props">
                <q-tr :props="props" style="cursor:pointer" @click="showDetails(props.row.id)">
                  <q-td key="login_ok" :props="props" style="width:50px">
                    <div class="text-pre-wrap" v-if="props.row.login_ok == 1">
                      <q-avatar size="xs" color="green-10" class="text-white" icon="check"></q-avatar>
                    </div>
                    <div class="text-pre-wrap" v-if="props.row.login_ok == 0">
                      <q-avatar size="xs" color="red-10" class="text-white" icon="close"></q-avatar>
                    </div>
                    <div class="text-pre-wrap" v-if="props.row.login_ok === null">-</div>
                  </q-td>
                  <q-td key="name" :props="props">
                    {{ props.row.name }}
                  </q-td>
                  <q-td key="unpaid" :props="props">
                    <div class="text-pre-wrap" v-if="props.row.unpaid !== null">$ {{props.row.unpaid}}</div>
                    <div class="text-pre-wrap" v-if="props.row.unpaid === null"> - </div>
                  </q-td>
                  <q-td key="settings_ok" :props="props">
                    <div class="text-pre-wrap" v-if="props.row.settings_ok === 1"><q-icon name="autorenew" /></div>
                    <div class="text-pre-wrap" v-if="props.row.settings_ok !== 1">-</div>
                  </q-td>
                  
                </q-tr>
              </template>

              <template v-slot:bottom >
                <div style="margin:0 auto">
                  <q-btn round dense flat
                    icon="chevron_left" color="grey-8"
                    v-if="commissions.table.pagination.page > 1"
                    @click="step('down')"
                  />

                  <span>Page {{commissions.table.pagination.page}} of {{commissions.table.pagination.lastpage}}</span>
                  <q-btn round dense flat
                    icon="chevron_right" color="grey-8"
                    v-if="commissions.table.pagination.lastpage != commissions.table.pagination.page "
                    @click="step('up')"
                  />
                </div>
              </template>
            </q-table>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-md-6">
        <q-card>
          <q-card-section>
            <div>
              <div>
                <span style="font-size:18px;font-weight:bold">Name: {{commissions.selected.name}}</span>  
              </div>

              <q-tabs
                v-model="commissions.tab"
                dense
                class="bg-grey-3 text-grey-7"
                active-color="primary"
                indicator-color="purple"
                align="justify"
              >
                <q-tab name="settings" label="Settings" />
                <q-tab name="affiliate" label="Affiliate" />
                <q-tab name="automation" label="Automation" />
              </q-tabs>

              <q-tab-panels v-model="commissions.tab" animated class="">
                <q-tab-panel name="settings">
                  <div class="q-gutter-md">
                    <q-input label="Store ID" outlined dense v-model="commissions.selected.store_id" disable>
                      <template v-slot:after>
                        <q-btn color="teal-5" :loading="commissions.save.btn.loading" @click="showEditStoreId" label="Edit Id"></q-btn>
                      </template>
                    </q-input>
                    <q-input label="Unpaid Balance" outlined dense v-model="commissions.selected.unpaid"></q-input>
                    <q-select outlined dense
                      emit-value
                      map-options
                      v-model="commissions.selected.aff_type_Id"
                      :options="commissions.affiliate.select.login_ok.types"
                      option-label="aff_type"
                      option-value="id"
                      label="Affiliate Type" color="teal" options-selected-class="text-deep-orange"
                    >
                      <template v-slot:option="scope">
                        <q-item v-bind="scope.itemProps">
                          <q-item-section>
                            <q-item-label>{{ scope.opt.aff_type }}</q-item-label>
                          </q-item-section>
                        </q-item>
                      </template>
                    </q-select>
                  </div>
                  <div class="q-pt-sm q-gutter-sm">
                      <q-btn dense color="primary" :loading="commissions.save.btn.loading" @click="saveSettings" label="Save"></q-btn>
                    </div>
                </q-tab-panel>

                <q-tab-panel name="affiliate">
                  <div class="q-gutter-md">
                    <q-input label="Affiliate URL" outlined dense v-model="commissions.selected.affiliate_url"></q-input>
                    <q-input label="Affiliate ID" outlined dense v-model="commissions.selected.affiliate_id"></q-input>
                    <q-input label="Username" outlined dense v-model="commissions.selected.username"></q-input>
                    <q-input label="Password" outlined dense v-model="commissions.selected.password"></q-input>
                    <q-select outlined emit-value map-options dense
                      v-model="commissions.selected.login_ok"
                      :options="commissions.affiliate.select.login_ok.options"
                      label="Login" color="teal" options-selected-class="text-deep-orange"
                    >
                      <template v-slot:option="scope">
                        <q-item v-bind="scope.itemProps">
                          <q-item-section avatar>
                            <q-icon :color="scope.opt.color" class="text-white" :name="scope.opt.icon" />
                          </q-item-section>
                          <q-item-section>
                            <q-item-label>{{ scope.opt.label }}</q-item-label>
                          </q-item-section>
                        </q-item>
                      </template>
                    </q-select>
                    <div class="q-pt-md q-gutter-md">
                      <q-btn dense color="primary" :loading="commissions.save.btn.loading" @click="saveSettings" label="Save"></q-btn>
                    </div>
                  </div>
                </q-tab-panel>

                <q-tab-panel name="automation">
                  <q-input label="Secure URL" outlined dense v-model="commissions.selected.secure_url"></q-input>
                  <q-input label="Header data" type="textarea" outlined dense v-model="commissions.selected.cors_header"></q-input>
                  <q-input label="Form data" type="textarea" outlined dense v-model="commissions.selected.extra_form_params"></q-input>
                  <q-input label="Dom target" outlined dense v-model="commissions.selected.dom_target"></q-input>
                  <q-input label="Search String" outlined dense v-model="commissions.selected.search_str"></q-input>
                  <div class="q-pt-md q-gutter-md">
                    <q-btn dense color="primary" :loading="commissions.test.btn.loading" @click="testAutomate" label="Test"></q-btn>
                    <q-btn dense color="primary" :loading="commissions.test.btn.loading" @click="testPage" label="Test Page"></q-btn>
                    <q-btn dense color="primary" @click="validate" label="Validate"></q-btn>
                    <q-btn dense color="primary" :loading="commissions.save.btn.loading" @click="saveSettings" label="Save"></q-btn>
                  </div>
                  <div class="q-pt-md">
                    <div>Test Result: </div>
                    <div><pre>{{commissions.test.result}}</pre></div>
                  </div>
                </q-tab-panel>

                
              </q-tab-panels>
            </div>

            <div>
              <!-- Store ID dialog -->
              <q-dialog
                v-model="fullWidth"
              >
                <q-card class="row q-pa-md" style="width: 1000px; height: 900px; max-width: 80vw;">
                  <q-card-section class="col-md-6">
                    <div class="q-gutter-sm" style="max-width: 550px">
                      <q-space/>
                      <span style="font-size:18px;font-weight:bold">Search Store</span>
                      <q-input outlined dense debounce="300" 
                        label="" color="primary" v-model="storeSearchData.search_str" :disable="storeSearchData.loading"
                        >
                        <template v-if="storeSearchData.search_str" v-slot:append>
                          <q-icon name="cancel" @click.stop="clearFilter(true)" class="cursor-pointer" />
                        </template>
                        <template v-slot:after>
                          <q-btn color="primary" :loading="storeSearchData.loading" @click="storeSearch" label="Search" />
                        </template>
                      </q-input>
                      <q-space/>
                      <span v-if="storeSearchData.noResult" style="font-size:18px;">No results for "{{storeSearchData.search_str}}"</span>
                      <div v-if="storeSearchData.search_result != ''">
                        <q-list v-for="store in storeSearchData.search_result" :key="store.name"  :loading="storeSearchData.loading" bordered>
                          <q-item clickable v-ripple @click="setStoreId(store.store_id)">
                            <q-item-section avatar>
                              <div class="text-pre-wrap" v-if="store.login_ok == 1">
                                <q-avatar size="xs" color="green-10" class="text-white" icon="check"></q-avatar>
                              </div>
                              <div class="text-pre-wrap" v-if="store.login_ok == 0">
                                <q-avatar size="xs" color="red-10" class="text-white" icon="close"></q-avatar>
                              </div>
                              <div class="text-pre-wrap" v-if="store.login_ok === null">-</div>
                            </q-item-section>

                            <q-item-section>{{store.name}}</q-item-section>
                          </q-item>
                        </q-list>
                      </div>
                    </div>
                  </q-card-section>

                  <q-card-section class="col-md-6">
                    <div class="q-gutter-sm">
                      <q-space/>
                      <span style="font-size:18px;font-weight:bold">Store Name: {{storeSearchData.selected.name}}</span>
                      <q-input label="Store ID" outlined dense v-model="storeSearchData.selected.store_id">
                        <template v-slot:after>
                          <q-btn label="Set Store ID" color="primary" v-close-popup />
                        </template>
                      </q-input>
                    </div>
                  </q-card-section>

                  
                </q-card>
              </q-dialog>
            </div>

          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    return {
      small: ref(false),
      medium: ref(false),
      fullWidth: ref(false),
      fullHeight: ref(false)
    }
  },

  data () {
    return {
      customtable: {
        pagination: {
          descending: false,
          page: 1,
          rowsNumber: 10,
          rowsperpage: [],
          max:0,
          display: false,
          lastpage: 0,
        },
        columns: [
          { name: 'login_ok', align: 'left', label: 'L', field: 'login_ok', sortable: true },
          { name: 'name', align: 'left', label: 'Name', field: 'name', sortable: true }
        ],
      },
      storeSearchData: {
        search_str: '',
        search_result: [],
        loading: false,
        noResult: false,
        selected: []
      },
      commissions: {
        table: {
          rows: [],
          columns: [
            { name: 'login_ok', align: 'left', label: 'L', field: 'login_ok', sortable: true },
            { name: 'name', align: 'left', label: 'Name', field: 'name', sortable: true },
            { name: 'unpaid', align: 'right', label: '$', field: 'unpaid', sortable: true },
            { name: 'settings_ok', align: 'right', label: 'Auto', field: 'settings_ok', sortable: true }
          ],
          filter: '',
          dialogFilter: '',
          loading: false,
          pagination: {
            descending: false,
            page: 1,
            rowsNumber: 20,
            rowsperpage: [],
            max:0,
            display: false,
            lastpage: 0,
          },
        },
        affiliate: {
          select: {
            login_ok: {
              model: '',
              options: [
                { label: 'Valid', value: 1, icon: 'check', color: 'green-10' },
                { label: 'Invalid Login', value: 0, icon: 'close', color: 'red-10' },
                { label: 'Unset', value: null, icon: 'block', color: 'grey-10' },
              ],
              types: []
            }
          }
        },
        header: {
          login_ok: {
            model: '-',
            options: [
              { label: 'OK', value: '1', icon: 'check', color: 'green-10' },
              { label: 'Invalid Logins', value: '0', icon: 'close', color: 'red-10' },
              { label: 'All', value: '-', icon: 'block', color: 'grey-10' }
            ]
          },
          settings_ok: {
            model: '-',
            options: [
              { label: 'Ready', value: '1', icon: 'check', color: 'green-10' },
              { label: 'All', value: '-', icon: 'close', color: 'red-10' },
            ]
          },
        },
        selected: [],
        tab: 'affiliate',
        test: {
          btn: {
            loading: false
          },
          result: ''
        },
        save: {
          btn: {
            loading: false
          }
        }
      }
    }
  },

  methods: {
    getAll() {
      // this.commissions.selected = []
      this.commissions.table.rows = []
      this.commissions.table.loading = true

      var params = []

      if(this.commissions.header.login_ok.model !== '-') {
        params.push(["login_ok", "=", this.commissions.header.login_ok.model])
      }

      if(this.commissions.header.settings_ok.model !== '-') {
        params.push(["settings_ok", "=", this.commissions.header.settings_ok.model])
      }

      if(this.commissions.table.filter !== '') {
        params.push(['name', 'ilike', "'%" + this.commissions.table.filter + "%'"])
      }

      

      this.$api.post('/commissions/all', {
        page: this.commissions.table.pagination.page,
        params: JSON.stringify(params)
      })
        .then(response => {
          this.commissions.table.rows = response.data.store_commissions
          this.commissions.table.pagination.page = response.data.page
          this.commissions.table.pagination.lastpage = response.data.lastpage
          this.commissions.table.loading = false
        })
    },

    storeSearch() {
      const params = []
      this.storeSearchData.loading = true
      if(this.storeSearchData.search_str !== '') {
        params.push(['name', 'ilike', "'%" + this.storeSearchData.search_str + "%'"])
      }
      this.$api.post('/commissions/all', {
        page: 1,
        params: JSON.stringify(params)
      })
      .then(response => {
        this.storeSearchData.search_result = response.data.store_commissions
        this.storeSearchData.noResult = this.storeSearchData.search_result == ''
        this.storeSearchData.loading = false
      })
      
    },

    setStoreId(id) {
      this.storeSearchData.selected.store_id = id
      this.commissions.selected.store_id = this.storeSearchData.selected.store_id
    },

    getAffTypes() {
      this.$api.get('/manage/getAffTypes', {
      })
      .then(response => {
        this.commissions.affiliate.select.login_ok.types = response.data.data
      })
    },

    showEditStoreId () {
       this.fullWidth = true
       this.storeSearchData.selected = this.commissions.selected
    },

    clearFilter(isDialog) {
      if (isDialog) {
        this.storeSearchData.search_str = ''
        this.storeSearchData.search_result = []
        this.storeSearchData.noResult = false
      } else {
        this.commissions.table.filter = ''
      }
      this.getAll()
    },

    showDetails(id) {
      this.commissions.selected = this.commissions.table.rows.filter(x => x.id === id)[0]     
    },

    step(a) {
      if(a === 'up') {
        this.commissions.table.pagination.page++
      } else {
        this.commissions.table.pagination.page--
      }
      this.getAll()
    },

    testAutomate() {
      this.commissions.test.btn.loading = true
      this.$api.post('/test/automate', {
        'secure_url': this.commissions.selected.secure_url,
        'dom_target': this.commissions.selected.dom_target,
        'search_str': this.commissions.selected.search_str,
        'cors_header': JSON.stringify(JSON.parse(this.commissions.selected.cors_header)),
        'extra_form_params': JSON.stringify(JSON.parse(this.commissions.selected.extra_form_params))
      })
        .then(response => {
          this.commissions.test.btn.loading = false
          this.commissions.test.result = response.data
        })
    },

    testPage() {
      this.commissions.test.btn.loading = true
      this.$api.post('/test/page', {
        'secure_url': this.commissions.selected.secure_url,
        'dom_target': this.commissions.selected.dom_target,
        'search_str': this.commissions.selected.search_str,
        'cors_header': JSON.stringify(JSON.parse(this.commissions.selected.cors_header)),
        'extra_form_params': JSON.stringify(JSON.parse(this.commissions.selected.extra_form_params))
      })
        .then(response => {
          this.commissions.test.btn.loading = false
          //this.commissions.test.result = response.data
        })
    },

    validate() {
      var currentIndex = this.commissions.table.rows.findIndex((obj => obj.id === this.commissions.selected.id))
      this.commissions.table.rows[currentIndex].settings_ok = 1

      var commission = this.commissions.test.result.commission
      this.commissions.table.rows[currentIndex].unpaid = commission

    },

    validateAuth () {
      var currentIndex = this.commissions.table.rows.findIndex((obj => obj.id === this.commissions.selected.id))
      this.commissions.table.rows[currentIndex].login_ok = parseInt(this.commissions.selected.login_ok)
      this.commissions.table.rows[currentIndex].affiliate_url = this.commissions.selected.affiliate_url
      this.commissions.table.rows[currentIndex].affiliate_id = this.commissions.selected.affiliate_id
      this.commissions.table.rows[currentIndex].username = this.commissions.selected.username
      this.commissions.table.rows[currentIndex].password = this.commissions.selected.password
    },

    saveSettings() {
      this.commissions.save.btn.loading = true
      this.$api.post('/commissions/updateSettings', {
        id: this.commissions.selected.id,
        data: JSON.stringify(this.commissions.selected)
      })
        .then(response => {
          this.commissions.save.btn.loading = false
        })
    }
  },

  created () {
    this.getAll()
    this.getAffTypes()
  }
}
</script>
