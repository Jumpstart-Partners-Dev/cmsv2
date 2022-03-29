<template>
  <div class="q-pa-md q-gutter-sm">

    <q-dialog
      v-model="medium"
    >
      <q-card class="row q-pa-md" style="width: 1000px; max-width: 80vw;">
        <q-card-section class="col-md-6">
          <q-table dense
            row-key="name" v-model:pagination="customtable.pagination"
            :rows="datatable.rows"
            :columns="customtable.columns"
            :filter="datatable.filter"
            :loading="datatable.loading"
          >
            <template v-slot:top>
              <q-input outlined dense debounce="300" 
                label="Search" color="primary" v-model="datatable.filter"
                @keydown.enter.prevent="getAll"
                >
                <template v-if="datatable.filter" v-slot:append>
                  <q-icon name="cancel" @click.stop="clearFilter" class="cursor-pointer" />
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
                  v-if="datatable.pagination.page > 1"
                  @click="step('down')"
                />

                <span>Page {{datatable.pagination.page}} of {{datatable.pagination.lastpage}}</span>
                <q-btn round dense flat
                  icon="chevron_right" color="grey-8"
                  v-if="datatable.pagination.lastpage != datatable.pagination.page "
                  @click="step('up')"
                />
              </div>
            </template>
          </q-table>
        </q-card-section>

        <q-card-section class="col-md-6">
          <div class="q-gutter-sm">
            <q-space/>
            <span style="font-size:18px;font-weight:bold">Store Name: {{data.name}}</span>
            <q-input label="Store ID" outlined dense v-model="data.store_id"/>
            <q-card-actions align="right">
              <q-btn label="Set Store ID" color="primary" v-close-popup />
            </q-card-actions>
          </div>
        </q-card-section>

        
      </q-card>
    </q-dialog>

  </div>
</template>

<script>
import { ref } from 'vue'
export default {
  // name: 'PageName',
  props: {
    reload: { type: Function },
    selected: {},
    commissionsTable: {}
  },
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
      datatable: this.commissionsTable,
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
      data: this.selected,
      dialog: {
        display: false,
        form: {
          fields: {
            username: '',
            password: '',
          }, 
          validation: {
            username: [
              val => !!val || "Field is requried"
            ]
          },
          refs: {
            usernameRef: null,
            passwordRef: null
          },
          submit: {
            btn: {
              loading: false
            }
          }
        }
      },
      result: {
        display: false,
        message: 'Username already taken'
      }
    }
  },

  methods: {
    generatePassword () {
      this.dialog.form.fields.password = Math.random().toString(36).slice(-6);
      
    },
    saveUser () {
      this.result.display = false
      if(this.$refs.usernameRef.validate()) {
        this.dialog.form.submit.btn.loading = true;
        this.$api.post('/users/register', {
          username: this.dialog.form.fields.username,
          password: this.dialog.form.fields.password
        })
          .then(response => {
            if(response.data.result === 1) {
              this.dialog.display = false
              this.reload()
            } else if (response.data.result === 0) {
              this.result.display = true
              this.result.message = response.data.message
            }
            this.dialog.form.submit.btn.loading = false
          })
      }
    },
    clearForm () {
      this.dialog.form.fields.username = ''
      this.dialog.form.fields.password = ''
      this.dialog.form.submit.btn.loading = false
    }
  }
}
</script>

<style scoped>
  .register-error-prompt {
    border: 1px solid rgb(250, 158, 158);
    padding: 5px 10px;
    background-color: #fdd8d8;
    border-radius: 5px;
    color: rgb(44, 44, 44);
  }
</style>