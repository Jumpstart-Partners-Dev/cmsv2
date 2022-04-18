<template>
  <div class="q-pa-md">
    <q-table
      title="Permissions"
      :rows="rows"
      :columns="cols"
      row-key="permissions"
      :loading= "loading"
      selection="multiple"
      no-data-label="alaws..."
      v-model:selected="selected"
      grid
    >

      <template v-slot:top-right>
        <q-btn color="primary" :disable="loading" label="Assign" @click="getSelected" />
      </template>
      
      <template v-slot:item="props">
        <div
          class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
          :style="props.selected ? 'transform: scale(0.95);' : ''"
        >
          <q-card :class="props.selected ? 'bg-grey-2' : ''">
            <q-card-section>
              <q-checkbox dense v-model="props.selected" :label="props.row.name" />
            </q-card-section>
            <q-separator />
            <q-list dense>
              <q-item v-for="col in props.cols.filter(col => col.name !== 'desc')" :key="col.permissions">
                <q-item-section>
                  <q-item-label>{{ col.label }}</q-item-label>
                </q-item-section>
                <q-item-section>
                  
                  <q-item-label v-if="col.label == 'Permissions'">{{ JSON.parse(col.value).areas }}</q-item-label>
                  <q-item-label caption v-else>{{ col.value }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card>
        </div>
      </template>
    </q-table>

    <div class="q-mt-md">
      Selected: {{ JSON.stringify(selected) }}
    </div>
  </div>
</template>

<script>

export default {
  // name: 'PageName',
  
  data () {
    return {
      data: [],
      selected: [],
      loading: false,
      cols:[
        { name: 'id', align: 'center', label: 'Id', field: 'id', sortable: true },
        {
          name: 'permissions',
          required: true,
          label: 'Permissions',
          align: 'left',
          field: row => row.permissions,
          format: val => `${val}`,
          sortable: true
        },
        { name: 'role_id', label: 'Role Id', field: 'role_id', sortable: true }
      ],
      rows:[
      ]
    }
  },

  methods: {
    getPermissions () {
      this.loading = true
      this.$api.get('/permission/getAll', {})
      .then(response => {
        this.rows = response.data.data
        this.loading = false
      })
    },
    getSelected () {
      const selectArr = []
      for(let val of this.selected) {
        selectArr.push(val.id)
      }
      return selectArr
    },
    assignPermission () {
      this.$api.get('')
    }
  },

  created() {
    this.getPermissions()
  }
}
</script>

<style scoped>
  .register-error-prompt {
    border: 1px solid rgb(250, 158, 158);
    padding: 5px 10px;
    background-color: #fdd8d8;
    border-radius: 5px;
    colzor: rgb(44, 44, 44);
  }
</style>