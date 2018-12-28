<template>
  <v-app>
    <Login @loginAdmin="loginAdmin" v-if="!isLogin"/>
    <Hello @logout="logout" v-if="isLogin"/>
  </v-app>
</template>

<script>
import Hello from './components/Hello'
import Login from './components/Login'

export default {
  name: 'App',
  components: {
    Hello,
    Login
  },
  data: ()=> ({
    isLogin:false,
    idAdmin:''
  }),
  created(){
    //if localStorage id Teknisi exist set login to true
    if(localStorage.getItem('@idAdmin')){
      
      this.isLogin = true
      this.idAdmin = localStorage.getItem('@idAdmin')
    }
  },
  methods:{
    loginAdmin(idAdmin){
      console.log('aa')
      this.isLogin = true
      this.idAdmin = idAdmin
    },
    logout(){
      this.isLogin = false
      this.idAdmin = ''
      localStorage.removeItem('@idAdmin')
    }
  } 
}
</script>
<style>
*{
  margin: 0px;
  padding: 0px;
}
*{
  -webkit-tap-highlight-color: rgba(0,0,0,0);
  
}
::-webkit-scrollbar {
    display: none;
}
</style>
