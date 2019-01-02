<template>
  <div class="login">
    <v-dialog v-model="dialog">
      <v-card :style="{'background-color':'white'}">
        <v-card-text :style="{'text-align':'center'}">
          <h2>LOGIN ERROR</h2>
          <v-btn
          dark
          color="red"
          @click="dialog = false"
        >
          OK
        </v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-text-field
        v-model="idAdmin"
        :rules="idAdminRules"
        :counter="10"
        label="ID ADMIN"
        required
      ></v-text-field>
      <v-text-field
        v-model="password"
        :rules="passwordRules"
        label="PASSWORD"
        type="password"
        required
      ></v-text-field>
      <v-btn
        :disabled="!valid"
        @click="submit"
      >
        submit
      </v-btn>
      <v-btn @click="clear">clear</v-btn>
    </v-form>
  </div>
</template>
<script>
import axios from 'axios'
import config from '../config.js'

export default {
  name: 'Login',
  props: {
  },
  data:()=>({
    valid: true,
    idAdmin: '',
    idAdminRules: [
      v => !!v || 'Name is required',
      v => (v && v.length <= 10) || 'Name must be less than 10 characters'
    ],
    password: '',
    passwordRules: [
      v => !!v || 'Password is required',
      v => (v && v.length <= 20) || 'Name must be less than 10 characters'
    ],
    dialog:false
  }),
  methods: {
    submit () {
      if (this.$refs.form.validate()) {
        let admin = axios.post(`http://${config.ip}:2000/loginAdmin`,{
          idAdmin : this.idAdmin,
          password : this.password
        })

        admin
        .then(result =>{
          if(result.data != 'gagal'){
            console.log(result.data)
            this.$emit('loginAdmin', result.data)
            localStorage.setItem('@idAdmin', result.data) 
          }else{
            this.dialog = true
          }
        })
      }
    },
    clear () {
      this.$refs.form.reset()
    }
      
  }
  
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
