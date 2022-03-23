<template>
  <q-page padding v-if="loaded">
    <div class="row q-pb-md q-col-gutter-md" >
      <div class="col-md-12">
        <q-btn label="Back" to="/stores" class="q-mr-md" icon="chevron_left"></q-btn>
        <q-btn label="SET: UNPUBLISH" class="bg-grey-5 q-mr-md" icon="lock"></q-btn>
        <q-btn label="remove store" class="bg-red-7 text-white" icon="delete"></q-btn>
      </div>
    </div>

    <div class="row q-col-gutter-md">
      <div class="col-md-8">
        <q-card >
          <q-card-section>
            <div class="row q-pb-md">
              <div class="col-md-3">
                <img :src="store.logo" alt="" style="width:100px; height:100px">
              </div>
              <div class="col-md-9">
                <span class="text-h4">{{ store.name }}</span>
                <div>Status: <span style="color:green">Published</span></div>
                <div>Affliate URL: <a :href="store.affiliate_url" target="_blank">{{ store.affiliate_url}}</a></div>
              </div>
            </div>

            <q-separator></q-separator>

            <div class="row">
              <div class="col-md-12">
                <div class="" style="max-height:100px;overflow:hidden;text-overflow: ellipsis;">
                  {{ store.head_description }}
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>

        <div class="row q-pt-md q-col-gutter-md">
          <div class="col-md-6">
            <q-card>
              <q-card-section>
                <div class="text-green-10 text-h6 q-pb-md">Coupons <q-btn align="left" color="primary" text-color="white" dense icon="add" label="New Coupon"></q-btn></div>
                <div class="q-pb-md">
                  <q-card class="bg-green-6 text-white">
                    <q-card-section>
                      CODE1 - 35%
                      <q-btn class="text-right" dense size="sm" icon="delete" color="red"></q-btn>
                    </q-card-section>
                  </q-card>
                </div>
                <div class="q-pb-md">
                  <q-card class="bg-green-6 text-white">
                    <q-card-section>
                      ATTEST1BBB - 10%
                      <q-btn class="text-right" dense size="sm" icon="delete" color="red"></q-btn>
                    </q-card-section>
                  </q-card>
                </div>
                <div class="q-pb-md">
                  <q-card class="bg-green-6 text-white">
                    <q-card-section>
                      AAAAAAA - 50%
                      <q-btn class="text-right" dense size="sm" icon="delete" color="red"></q-btn>
                    </q-card-section>
                  </q-card>
                </div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-md-6">
            <q-card>
              <q-card-section>
                <div class="text-orange-10 text-h6">Deals <q-btn align="left" color="primary" text-color="white" dense icon="add" label="New Deal"></q-btn></div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="row q-mb-md">
          <div class="col-md-12">
            <q-card>
              <q-card-section>
                <div class="text-h6">Commissions</div>
                <div class="text-h3">$ {{ commission.unpaid }}</div>
                <div>
                  <q-btn dense size="sm" icon="refresh" class="bg-grey-8 text-white q-mr-sm" @click="mock" label="auto-check" ></q-btn>
                  <q-btn dense size="sm" icon="settings" class="bg-grey-8 text-white" label="settings" ></q-btn>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>

        <div class="row q-mb-md">
          <div class="col-md-12">
            <q-card>
              <q-card-section>
                <div class="text-h6">FAQ and Saving Tips</div>
                <div style="min-height:300px">
                  {FAQ node list}
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  data () {
    return {
      store: [],
      commission: {
        unpaid: 0
      },
      loaded: false
    }
  },

  methods: {
    loadStore() {
      this.store.name = ''
      this.$api.get('/admin/getStore/' + this.$route.params.id, {})
        .then(response => {
          this.store = response.data.store
          if (response.data.commission !== null) {
            this.commission = response.data.commission
          }
          
          this.loaded = true
        })
    },

    mock() {
      this.$api.get('/mock', {})
        .then(response => {
          this.loadStore()
        })
    }
  },

  created () {
    this.loadStore()
  }
}
</script>
