<template>
  <q-page padding>
    <div class="row">
      <div class="col-md-12">
        
        <q-table
          title="Users"
          :rows="users.table.rows"
          :columns="users.table.columns"
          row-key="name"
          selection="multiple"
          v-model:selected="users.table.selected"
          :filter="users.table.filter"
          grid
          hide-header
          :rows-per-page-options="[0]"
          :loading="users.table.loading"
        >
          <template v-slot:top>
            <span class="text-h6 q-mr-md">Users</span>
            <q-btn class="q-mr-md" size="md" dense color="primary" icon="add" label="Add New" @click="showNewUserModal" />
            <q-btn size="md" dense icon="refresh" label="Refresh" @click="reload" />
            <q-space />
            <q-input outlined dense debounce="300" label="Search" color="primary" v-model="users.table.filter">
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </template>

          <template v-slot:item="props">
            <div
              class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
              :style="props.selected ? 'transform: scale(0.95);' : ''"
            >
              <q-card :class="props.selected ? 'bg-grey-2' : ''">
                <q-card-section class="bg-blue-2">
                  <q-avatar class="q-mr-md q-mb-sm">
                    <img src="https://cdn.quasar.dev/img/boy-avatar.png">
                  </q-avatar>
                  <span class="text-h6" v-if="props.row.firstname !== null">{{ props.row.firstname }} {{ props.row.lastname }}</span>
                  <span class="text-h6" v-if="props.row.firstname === null">(Profile Not Set)</span>
                  <div>
                    <span class="q-mr-sm" v-if="props.row.firstname === null" style="font-size:13px; text-decoration: underline; cursor: pointer"></span> 
                    <q-btn dense size="sm" color="white" text-color="black" class="q-mr-sm" label="Edit" icon="edit"></q-btn>
                    <q-btn dense size="sm" color="white" text-color="red-10" class="q-mr-sm" label="Delete" icon="delete"></q-btn>
                  </div>
                </q-card-section>
                <q-separator />
                <q-list dense>
                  <q-item v-for="col in props.cols.filter(col => col.name !== 'enabled')" :key="col.name">
                    <q-item-section>
                      <q-item-label>{{ col.label }}</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-item-label caption>{{ col.value }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-item-label>Enabled</q-item-label>
                    </q-item-section>
                    <q-item-section avatar>
                      <q-toggle dense color="blue" v-model="props.row.enabled" @update:model-value="toggleAble(props.row.id, props.row.enabled)" 
                        :false-value="0"
                        :true-value="1"/>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-item-label>Password</q-item-label>
                    </q-item-section>
                    <q-item-section avatar>
                      <q-item-label>********** <q-btn size="md" dense flat class="text-yellow-10" style="" label="Reset" /></q-item-label>
                      
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-item-label>Permissions</q-item-label>
                    </q-item-section>
                    <q-item-section avatar>
                      <q-btn size="md" dense flat class="text-blue" style="" label="Set Permissions" />
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card>
            </div>
          </template>
          
        </q-table>
      </div>
    </div>

    <new-user ref="NewUser" :reload="reload" :users="users"></new-user>
  </q-page>
</template>

<script>
import NewUser from './components/NewUser'

export default {
  components: {
    NewUser
  },

  data () {
    return {
      users: {
        table: {
          rows: [
            { id: 1, firstname: null, username: 'belarmino.joshua', enabled: 1},
          ],
          columns: [
            { name: 'id', align: 'center', label: 'ID', field: 'id' },
            { name: 'username', align: 'center', label: 'Username', field: 'username', sortable: true },
            { name: 'enabled', align: 'center', label: 'Enabled', field: 'enabled', sortable: true },
          ],
          selected: [],
          filter: '',
          loading: false,
        },
      }
    }
  }, 

  methods: {
    showNewUserModal () {
      this.$refs.NewUser.clearForm()
      this.$refs.NewUser.generatePassword()
      this.$refs.NewUser.dialog.display = true
    },

    reload () {
      this.users.table.rows = []
      this.users.table.loading = true
      this.$api.get('/users/getAll', function() {})
        .then(response => {
          if(response.data.error === false) {
            this.users.table.rows = response.data.users
          }
          this.users.table.loading = false
        })
    },

    toggleAble (id, state) {
      this.$api.post('/users/setAble', {
        id: id,
        state: state
      })
        .then(response => {
          if(response.data.error === false) {
            
          } 
        })
    }

  },

  created () {
    this.reload()
  }
}
</script>
