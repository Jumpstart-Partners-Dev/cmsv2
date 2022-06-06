<template>
  <q-dialog v-model="dialog.display">
    <q-card style="width: 450px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Edit User {{user.user_id}}</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-separator></q-separator>

      <q-card-section>
        <div v-if="result.display" class="register-error-prompt q-mb-md">{{ result.message }}</div>

        <q-input dense ref="usernameRef" outlined class="q-mb-md" label="Username" v-model="dialog.form.fields.username"
          :rules="dialog.form.validation.username" lazy-rules="ondemand"
        ></q-input>
        <q-input dense ref="passwordRef" disable outlined class="q-mb-md" label="Password" v-model="dialog.form.fields.password">
          <template v-slot:after>
            <q-btn label="Generate" :loading="dialog.form.submit.btn.loading" icon="refresh" @click.stop="generatePassword"></q-btn>
          </template>
        </q-input>
        
        <div class="text-right">
          <q-btn color="primary" label="Save" :loading="dialog.form.submit.btn.loading" icon="save" @click.stop="saveUser"></q-btn>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  // name: 'PageName',
  props: {
    reload: { type: Function }
    
  },
  data () {
    return {
      user: {},
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