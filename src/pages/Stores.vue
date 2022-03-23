<template>
  <q-page padding>
    <div class="row q-col-gutter-md q-pb-md">
      <div class="col-md-3">
        <q-card class="my-card bg-purple text-white">
          <q-card-section>
            <div class="text-subtitle2">Total Stores</div>
            <div class="text-h6">{{ store.total }}</div>
            
          </q-card-section>
        </q-card>
      </div>
      
      <div class="col-md-3">
        <q-card class="my-card bg-orange text-white">
          <q-card-section>
            <div class="text-subtitle2">Unpaid Commissions</div>
            <div class="text-h6">$ {{ store.commissions }}</div>
            
          </q-card-section>
        </q-card>
      </div>
    </div>
    <div class="row q-pa-md">
      <div class="col-md-12">
        <q-btn-group spread outline>
          <q-btn align="left" outline color="brown" icon="add" label="Add New Store" />
          <q-btn align="left" outline color="brown" icon="refresh" to="/stores/commissions" label="Check Commission" />
          <q-btn align="left" outline color="brown" icon="upload" label="Upload Store Data" />
        </q-btn-group>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <q-table
          title="Stores"
          dense
          :rows="store.rows"
          :columns="store.columns"
          row-key="id"
          :loading="store.storesListLoading"
          :visible-columns="store.visibleColumns"
          v-model:pagination="store.pagination"
          :rows-per-page-options="[0]"
        >
          <template v-slot:top>
            
            <q-space />
            <q-btn size="md" class="q-mr-md" color="white" icon="refresh" text-color="black" :loading="storesListLoading" label="refresh" @click="get().stores()" />
            <q-input dense outlined debounce="300" color="primary" v-model="store.filter" @keydown.enter.prevent="search">
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </template>
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td key="id" :props="props">
                {{ props.row.id }}
              </q-td>
              <q-td key="logo" :props="props">
                <img :src="props.row.logo" alt="" style="width:50px;height:50px">
              </q-td>
              <q-td key="name" :props="props">
                <div class="text-pre-wrap">{{ props.row.name }}</div>
              </q-td>
              <q-td key="commission" :props="props">
                <div class="text-pre-wrap">$ 0</div>
              </q-td>
              <q-td key="actions" :props="props">
                <q-btn size="sm" :to="'/store/' + props.row.id" dense color="white" class="q-mr-sm" text-color="black" icon="visibility"></q-btn>
                <q-btn size="sm" dense color="white" class="q-mr-sm" text-color="black" icon="link"></q-btn>
                <q-btn size="sm" dense color="white" class="q-mr-sm" text-color="black" icon="edit"></q-btn>
                <q-btn size="sm" dense color="red" icon="delete"></q-btn>
              </q-td>
            </q-tr>
          </template>
          
        </q-table>

        <div class="row justify-center q-mt-md" v-if="store.pagination.display">
          <q-btn
            icon="first_page"
            color="grey-8"
            round
            dense
            flat
            v-if="store.pagination.page < 0"
          />

          <q-btn
            icon="chevron_left"
            color="grey-8"
            round
            dense
            flat
            v-if="store.pagination.page > 1"
            @click="step('down')"
          />

          <span class="q-mt-sm">{{ store.pagination.page }}  / {{ store.pagination.max }}</span>

          <q-btn
            icon="chevron_right"
            color="grey-8"
            round
            dense
            flat
            @click="step('up')"
          />

          <q-btn
            icon="last_page"
            color="grey-8"
            round
            dense
            flat
            v-if="store.pagination.page < 0"
          />
        </div>
        
      </div>
    </div>
  </q-page>
</template>

<script>

export default {
  data () {
    return {
      store: {
        columns: [
          { name: 'id', label: 'ID', align: 'left', field: row => row.id },
          { name: 'logo', align: 'left', label: 'Logo', field: 'logo', sortable: false, style: "width: 100px" },
          { name: 'name', align: 'left', label: 'Name', field: 'name', sortable: true },
          { name: 'commission', align: 'right', label: 'Commission', field: 'commission', sortable: true, style: "width:100px" },
          { name: 'actions', align: 'right', label: '', field: 'actions', sortable: false, style: "width:200px"},
          ],
        rows: [ ],
        storesListLoading: false,
        visibleColumns: [ 'logo', 'name', 'commission', 'actions' ],
        filter: '',
        pagination: {
          descending: false,
          page: 1,
          rowsNumber: 20,
          rowsperpage: [],
          max:0,
          display: false
        },
        total: 0,
        commissions: 0
      }
    }
  },
  methods: {
    get () {
      var self = this;
      return {
        stores () {
          self.store.storesListLoading = true
          self.store.rows = []
          self.$api.get('/admin/getStores?page=' + self.store.pagination.page + '&filter=' + self.store.filter, {  })
            .then(response => {
              self.store.rows = response.data.data.data
              self.store.pagination.max = response.data.data.last_page
              self.store.storesListLoading = false
              self.store.pagination.display = true
              if(self.store.pagination.page === 1) {
                self.store.total = response.data.total
                self.store.commissions = response.data.commissions
              }
            })
        }
      }
    },

    step(word) {
      if ( word === "up") {
        this.store.pagination.page++
        this.get().stores()
      } else if (word === "down") {
        this.store.pagination.page--
        this.get().stores()
      }
    },

    search () {
      this.store.pagination.display = false
      this.get().stores()
    },

    loadStores () {
      this.get().stores()
      
    }
  },
  created () {
    this.loadStores()
  }
}
</script>
