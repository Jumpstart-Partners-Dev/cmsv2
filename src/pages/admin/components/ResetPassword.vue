<template>
  <q-dialog v-model="dialog.display">
    <q-card style="width: 450px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Reset Password</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-separator></q-separator>

      <q-card-section>
        <div v-if="result.display" class="register-error-prompt q-mb-md">{{ result.message }}</div>

        <q-input dense ref="passwordRef" disable outlined class="q-mb-md" label="Password" v-model="dialog.form.fields.password">
          <template v-slot:after>
            <q-btn label="Generate" :loading="dialog.form.submit.btn.loading" icon="refresh" @click.stop="generatePassword"></q-btn>
          </template>
        </q-input>
        
        <div class="text-right">
          <q-btn color="primary" label="Save" :loading="dialog.form.submit.btn.loading" icon="save" @click.stop="savePassword"></q-btn>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  // name: 'PageName',
  props: {
    reload: { type: Function },
    usersID: {}
  },
  data () {
    return {
      user_id: '',
      dialog: {
        display: false,
        form: {
          fields: {
            username: '',
            password: '',
          },
          refs: {
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
    savePassword () {
      this.result.display = false
      this.dialog.form.submit.btn.loading = true;
      this.$api.post('/users/resetPassword', {
        id: this.user_id,
        password: this.dialog.form.fields.password
      })
        .then(response => {
          if(response.data.result === 1) {
            // this.dialog.display = false
            this.result.message = 'Success'
            this.result.display = true
            console.log('done')
            this.reload()
          } else if (response.data.result === 0) {
            this.result.message = 'Error'
            this.result.display = true
          }
          this.dialog.form.submit.btn.loading = false
        })
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