<template>
  <q-page padding>
    <div class="row justify-center">
      <div class="col-4">
        <q-card style="margin-top:120px">
          <q-card-section>
            <div class="text-h5 text-center text-bold">COUPONS PLUS DEALS</div>
          </q-card-section>

          <q-separator inset />

          <q-card-section v-if="login.display">
            <div class="q-mb-sm" v-if="login.notif !== ''">{{login.notif}}</div>
            <div class="q-mb-sm text-red-10" v-if="login.error !== ''">{{login.error}}</div>
            <q-input class="q-mb-md" label="Username" outlined v-model="login.form.fields.username"></q-input>
            <q-input class="q-mb-md" label="Password" type="password" v-on:keyup.enter="initLogin()" outlined v-model="login.form.fields.password"></q-input>
            <div class="text-right">
              <q-btn color="primary" label="Login" :loading="login.form.button.loading" @click="initLogin"></q-btn>
            </div>
          </q-card-section>
          <q-card-section v-if="reset.display">
            <div class="q-mb-sm">Please enter new password </div>
            <div class="q-mb-sm text-red-10" v-if="reset.error !== ''">{{reset.error}}</div>
            <q-input class="q-mb-md" label="New Password" type="password" outlined v-model="reset.form.fields.password"></q-input>
            <q-input class="q-mb-md" label="Confirm Password" type="password" v-on:keyup.enter="initReset()" outlined v-model="reset.form.fields.confirm"></q-input>
            <div class="text-right">
              <q-btn color="primary" label="Confirm Change Password" :loading="reset.form.button.loading" @click="initReset"></q-btn>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  // name: 'PageName',
  data () {
    return {
      login: {
        error: '',
        notif: '',
        display: true,
        form: {
          fields: {
            username: '',
            password: '',
          },
          button: {
            loading: false
          }
        }
      },
      
      reset: {
        error: '',
        display: false,
        form: {
          fields: {
            password: '',
            confirm: ''
          },
          button: {
            loading: false
          }
        }
      },

      user: [],
    }
  },

  methods: {
    initLogin() {
      this.login.error = ''
      this.login.notif = ''
      this.login.form.button.loading = true
      this.$api.post('/auth/login', {
        username: this.login.form.fields.username,
        password: this.login.form.fields.password
      })
        .then(response => {
          this.login.form.button.loading = false
          if(response.data.success) {
            this.user = response.data.user
            if(this.user.reset === 1) {
              this.login.display = false
              this.reset.display = true
              this.login.form.fields.password = ''
            } else {
              this.$q.localStorage.set('user', this.user)
              this.$router.push('/dashboard');
            }
          } else {
            this.login.error = 'Invalid username or password! Please try again!'
            this.login.form.fields.password = ''
          }
          
        })
    },

    initReset() {
      this.reset.error = ''
      this.reset.form.button.loading = true

      if (this.reset.form.fields.password !== this.reset.form.fields.confirm) {
        this.reset.error = 'Error: Password mismatch! '
      } else {
        // proceed
        this.$api.post('/auth/changepass', {
          id: this.user.user_id,
          password: this.reset.form.fields.password
        })
          .then(response => {
            this.reset.form.button.loading = false
            this.login.notif = 'Password change successful. You may login now.'
            this.reset.display = false,
            this.login.display = true
          })
      }
    }
  },

  created () {
    if(this.$q.localStorage.has('user')) {
      this.$router.push('/dashboard')
    }
  }
}
</script>
