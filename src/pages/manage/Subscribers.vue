<template>
  <q-page padding>
    <div class="row">
      <div class="col-md-5">
        <q-table
          title="Subscribers"
          dense
          :rows="rows"
          :columns="columns"
          row-key="email"
          :loading="loading"
        />
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  // name: 'PageName',
  data () {
    return {
      columns: [
        { name: 'email', align: 'left', label: 'Email', field: 'email', sortable: true }
      ],
      rows: [],
      loading: false
    }
  },
  methods: {
    preload () {
      this.loading = true
      this.$api.get('/subscribe/getSubscribers', {

      })
        .then(response => {
          this.rows = response.data.data
          this.loading = false
        })
    }
  },
  created () {
    this.preload()
  }
}
</script>
