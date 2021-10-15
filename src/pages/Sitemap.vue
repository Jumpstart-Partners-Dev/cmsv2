<template>
  <q-page padding>
    <div class="text-h5 q-pb-md">SITEMAP MANAGER</div>
    <div class="q-pb-md">
      <q-btn @click="reloadSitemap" color="primary">Generate Sitemap</q-btn>
    </div>
    <q-table
      title=""
      :rows="rows"
      :columns="columns"
      row-key="url"
      :pagination="initialPagination"
      :loading="loader"
      style="min-height:300px"
    >
      <template v-slot:body="props">
        <q-tr :props="props"  v-if="showTable === true">
          <q-td key="url" :props="props">
            <a :href="props.row.url" target="_blank">{{ props.row.url }}</a>
          </q-td>
          <q-td key="count" :props="props">
            {{ props.row.count }}
          </q-td>
          <q-td key="bing" :props="props">
            <q-icon name="check_circle" class="text-green" style="font-size:30px"/>
          </q-td>
          <q-td key="google" :props="props">
            <q-icon name="check_circle" class="text-green" v-if="props.row.google === 'success'" style="font-size:30px"/>
            <q-spinner-oval color="amber" v-if="props.row.google === 'pending'" style="font-size:30px" />
          </q-td>
          <q-td key="action" :props="props">
            <q-btn color="primary" @click="resubmit(props.row.url)">Re-submit</q-btn>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </q-page>
</template>

<script>
export default {
  data () {
    return {
      loader: false,
      showTable: true,
      columns: [
        {
          name: 'url',
          required: true,
          label: 'Sitemap',
          align: 'left',
          field: 'url'
        },
        { name: 'count', label: '# Urls', field: 'count' },
        { name: 'bing', align: 'center', label: 'Bing', field: 'bing', sortable: true },
        { name: 'google', align: 'center', label: 'Google', field: 'google', sortable: true },
        { name: 'action', label: '', field: 'action' },
      ],
      rows: [
        { url: 'https://www.couponsplusdeals.com/sitemap_stores_1_t5.txt', count: '20000', bing: 'success', google: 'success', action:'', },
        { url: 'https://www.couponsplusdeals.com/sitemap_stores_2_t5.txt', count: '20000', bing: 'success', google: 'success', action:'', },
        { url: 'https://www.couponsplusdeals.com/sitemap_stores_3_t5.txt', count: '20000', bing: 'success', google: 'success', action:'', },
        { url: 'https://www.couponsplusdeals.com/sitemap_stores_4_t5.txt', count: '20000', bing: 'success', google: 'success', action:'', },
        { url: 'https://www.couponsplusdeals.com/sitemap_stores_5_t5.txt', count: '20000', bing: 'success', google: 'pending', action:'', },
        { url: 'https://www.couponsplusdeals.com/sitemap_stores_6_t5.txt', count: '20000', bing: 'success', google: 'pending', action:'', },
        { url: 'https://www.couponsplusdeals.com/sitemap_stores_7_t5.txt', count: '20000', bing: 'success', google: 'pending', action:'', },
        { url: 'https://www.couponsplusdeals.com/sitemap_stores_8_t5.txt', count: '20000', bing: 'success', google: 'pending', action:'', },
        { url: 'https://www.couponsplusdeals.com/sitemap_stores_9_t5.txt', count: '20000', bing: 'success', google: 'success', action:'', },
        { url: 'https://www.couponsplusdeals.com/sitemap_stores_10_t5.txt', count: '20000', bing: 'success', google: 'pending', action:'', },
        { url: 'https://www.couponsplusdeals.com/sitemap_stores_11_t5.txt', count: '20000', bing: 'success', google: 'pending', action:'', },
        { url: 'https://www.couponsplusdeals.com/sitemap_stores_12_t5.txt', count: '20000', bing: 'success', google: 'success', action:'', },
        { url: 'https://www.couponsplusdeals.com/sitemap_stores_13_t5.txt', count: '20000', bing: 'success', google: 'pending', action:'', },
        { url: 'https://www.couponsplusdeals.com/sitemap_stores_14_t5.txt', count: '20000', bing: 'success', google: 'pending', action:'', },
        { url: 'https://www.couponsplusdeals.com/sitemap_stores_15_t5.txt', count: '20000', bing: 'success', google: 'pending', action:'', },
        { url: 'https://www.couponsplusdeals.com/sitemap_stores_16_t5.txt', count: '20000', bing: 'success', google: 'pending', action:'', },
        { url: 'https://www.couponsplusdeals.com/sitemap_stores_17_t5.txt', count: '3912', bing: 'success', google: 'success', action:'', },
        
      ],
      initialPagination: {
        descending: false,
        page: 1,
        rowsPerPage: 20
      },
    }
  },
  methods: {
    reloadSitemap () {
      this.loader = true
      this.showTable = false

      const self = this;
      this.intervalid1 = setInterval(function(){
        self.loader = false
        self.showTable = true
      }, 3000);
    },

    resubmit (url) {
      this.$q.notify({
        message: "'" + url + "' resubmitted",
        color: 'green',
        timeout: 5000,
        position: 'top'
      })
    }
  }
  // name: 'PageName',
}
</script>
