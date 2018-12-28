<template>
  <div class="hello" :style="{ 'background-color':'#F48FB1'}">
     <v-container fluid :style="{ height:'100vh'}" grid-list-md text-xs-center>
        <v-dialog v-model="dialogAll" persistent max-width="290">
          <v-card>
            <v-card-title class="headline">{{msgDialogT}}</v-card-title>
            <v-card-text>{{msgDialog}}</v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="green darken-1" flat @click="closeDialogAll">Close</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-layout row justify-center>
          <v-dialog v-model="dialogAddPC" persistent scrollable max-width="60%">
            <v-card>
              <v-card-title>Add Computer</v-card-title>
              <v-divider></v-divider>
              <v-card-text style="height: 80vh;">
                <v-form ref="form" v-model="valid" lazy-validation>
                   <v-chip color="pink" text-color="white">
                    <v-avatar>
                      <v-icon>account_circle</v-icon>
                    </v-avatar>
                    {{newId}}
                  </v-chip>
                  <v-text-field
                    v-model="nama"
                    :rules="namaRules"
                    :counter="20"
                    label="Nama"
                    required
                  ></v-text-field>
                  <v-text-field
                    v-model="password"
                    :rules="passwordRules"
                    :counter="20"
                    label="Password"
                    type="password"
                    required
                  ></v-text-field>
                  <v-text-field
                    v-model="noHPUser"
                    :rules="noHPUserRules"
                    label="NO HP(+62)"
                    type="number"
                    required
                  ></v-text-field>
                  <v-text-field
                    v-model="namaKomputer"
                    :rules="namaKomputerRules"
                    :counter="20"
                    label="Nama Komputer"
                    required
                  ></v-text-field>
                  <v-expansion-panel
                    v-model="panel"
                    :style="{'margin-top':'20px'}"
                    expand
                  >
                    <v-expansion-panel-content>
                      <div slot="header">Keluhan</div>
                      <v-card :style="{padding:'20px'}">
                        <v-form :style="{display:'flex','margin-bottom':'10px'}" ref="formAddKeluhan" v-model="validKeluhan" lazy-validation>
                          <v-text-field
                            :counter="20"
                            label="Tambahkan Keluhan Baru"
                            v-model="namaKeluhan"
                            :rules="namaKeluhanRules"
                          ></v-text-field>
                          <v-btn :disabled="!validKeluhan" @click="addKeluhan" color="blue darken-1" dark>ADD</v-btn>
                        </v-form>
                        <v-autocomplete
                          v-model="keluhanDipilih"
                          :items="keluhan"
                          label="Pilih Keluhan"
                          chips
                          clearable
                          prepend-icon="filter_list"
                          solo
                          multiple
                          @focus="focusKeluhan"
                        >
                          <template slot="selection" slot-scope="data">
                            <v-chip
                              :selected="data.selected"
                            >
                              <strong>{{ data.item }}</strong>&nbsp;
                              <span>(keluhan)</span>
                            </v-chip>
                          </template>
                        </v-autocomplete>
                      </v-card>
                    </v-expansion-panel-content>
                    <v-expansion-panel-content>
                      <div slot="header">Kelengkapan</div>
                      <v-card :style="{padding:'20px'}">
                        <v-form :style="{display:'flex','margin-bottom':'10px'}" ref="formAddKelengkapan" v-model="validKeluhan" lazy-validation>
                          <v-text-field
                            :counter="20"
                            label="Tambahkan Kelengkapan Baru"
                            v-model="namaKelengkapan"
                            :rules="namaKelengkapanRules"
                          ></v-text-field>
                          <v-btn :disabled="!validKelengkapan" @click="addKelengkapan" color="blue darken-1" dark>ADD</v-btn>
                        </v-form>
                        <v-autocomplete
                          v-model="kelengkapanDipilih"
                          :items="kelengkapan"
                          label="Pilih Kelengkapan"
                          chips
                          clearable
                          prepend-icon="filter_list"
                          solo
                          multiple
                          @focus="focusKelengkapan"
                        >
                          <template slot="selection" slot-scope="data">
                            <v-chip
                              :selected="data.selected"
                            >
                              <strong>{{ data.item }}</strong>&nbsp;
                              <span>(Kelengkapan)</span>
                            </v-chip>
                          </template>
                        </v-autocomplete>
                      </v-card>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-form>
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions>
                <v-btn color="blue darken-1" flat @click="closeDialogAddPC">Close</v-btn>
                <v-btn :disabled="!valid" @click="submit" color="blue darken-1" flat>Save</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-layout>
        <v-layout row wrap>
           <v-progress-linear color="pink" v-if="loading" :indeterminate="true"></v-progress-linear>
          <v-flex v-if="!selected && !loading" xs12>
            <v-card :style="{'padding-left':'20px','padding-right':'20px',width:'100%'}">
              <div>{{namaAdmin}}</div>
              <v-text-field v-model="searchValue" color="pink accent-3" prepend-icon="search" label="Search Computer ID"></v-text-field>
            </v-card>
            <v-card  height="80vh" color="pink lighten-4" :style="{overflow:'auto',display:'flex', 'align-items':'flex-start', 'align-content':'flex-start', 'justify-content':'center', 'flex-wrap':'wrap'}">
              <CardPC @closeModal="closePcModal" @viewDetails="openPcModal" v-for="(computer,index) in filtered" :key="index" 
                :idComputer="computer.idKomputer" 
                :tanggalMasuk="computer.tanggalMasuk" 
                :tanggalValidasi="computer.tanggalValidasi"
                :tanggalDikerjakan="computer.tanggalDikerjakan"
                :tanggalSelesai="computer.tanggalSelesai"
                :tanggalKeluar="computer.tanggalKeluar" />
            </v-card>
          </v-flex>
          <PC v-if="selected" @closeModal="closePcModal"/>
          <v-btn @click="addPCModal" :style="{ position:'fixed', left:'5%', top:'80%', 'z-index':'100'}" fab dark color="pink darken-4">
            <v-icon dark>add</v-icon>
          </v-btn>
          <v-btn @click='logout' :style="{ position:'fixed', right:'5%', top:'80%', 'z-index':'100'}" fab dark color="pink darken-4">
            <v-icon dark>arrow_back_ios</v-icon>
          </v-btn>
        </v-layout>
        
     </v-container>
  </div>
</template>

<script>
import axios from 'axios'
import config from '../config.js'
import CardPC from './CardPC'
import PC from './PC'
export default {
  name: 'Hello',
  components:{
    CardPC,
    PC
  },
  data: () => ({
    dialogAll:false,
    msgDialogT:'',
    msgDialog:'',
    panel: [],
    kelengkapanDipilih: [],
    kelengkapan: ['kel 1', 'kel 2'],
    keluhanDipilih: [],
    keluhan: ['Streaming', 'Eating'],
    newId:'',
    valid: true,
    validKeluhan: true,
    validKelengkapan: true,
    nama: '',
    namaRules: [
      v => !!v || 'Name is required',
      v => (v && v.length <= 20) || 'Name must be less than 10 characters'
    ],
    password:'',
    passwordRules: [
      v => !!v || 'Password is required',
      v => (v && v.length <= 20) || 'Name must be less than 10 characters'
    ],
    noHPUser: '',
    noHPUserRules: [
      v => !!v || 'NO HP is required',
      v => (v && v.length <= 20) || 'Name must be less than 10 characters'
    ],
    namaKomputer: '',
    namaKomputerRules: [
      v => !!v || 'Name is required',
      v => (v && v.length <= 20) || 'Name must be less than 10 characters'
    ],
    namaKeluhan: '',
    namaKeluhanRules: [
      v => !!v || 'Name is required',
      v => (v && v.length <= 20) || 'Name must be less than 10 characters'
    ],
    namaKelengkapan: '',
    namaKelengkapanRules: [
      v => !!v || 'Name is required',
      v => (v && v.length <= 20) || 'Name must be less than 10 characters'
    ],
    dialogAddPC:false,
    loading : true,
    detailKomputer:'',
    computers:[],
    selected:null,
    filtered:[],
    searchValue:'',
    pcModal:false,
    idAdmin:'',
    namaAdmin :'',
    noHPAdmin :''
  }),
  created(){
    this.idAdmin = localStorage.getItem('@idAdmin')
    this.getAdmin()
    if(localStorage.getItem('@Komputer')){
        this.selected = true  
    }
    if(localStorage.getItem('@addPC')){
      this.dialogAddPC = true
    }
    if(localStorage.getItem('@newId')){
      this.newId = localStorage.getItem('@newId')
    }
    
    this.getSemuaKomputer() 
  },
  methods:{
    closeDialogAll(){
       window.location.reload()
    },
    focusKeluhan(){
      axios.get(`http://${config.ip}:2000/allKeluhan`)
      .then(result =>{
        let temp = []
        result.data.forEach(v =>{
          temp.push(v.keluhan)
        })
        this.keluhan = temp
        console.log(this.keluhanDipilih)
      })
      .catch(err =>{
        console.log(err)
      })
    },
    focusKelengkapan(){
      axios.get(`http://${config.ip}:2000/allKelengkapan`)
      .then(result =>{
        let temp = []
        result.data.forEach(v =>{
          temp.push(v.kelengkapan)
        })
        this.kelengkapan = temp
        console.log(this.kelengkapan)
      })
      .catch(err =>{
        console.log(err)
      })
    },
    closeDialogAddPC(){
      this.dialogAddPC = false
      localStorage.removeItem('@addPC')
    },
    addPCModal(){
      let id = axios.get(`http://${config.ip}:2000/randomId`)
      id
      .then(result =>{
        if(result.data != 'sudah ada'){
          this.newId = result.data
          this.dialogAddPC = true
          localStorage.setItem('@addPC',true)
          localStorage.setItem('@newId',result.data)
        }else {
          alert('Silahkan Coba Lagi')  
        }
      })
    },
    addKeluhan(){
      if (this.$refs.formAddKeluhan.validate()) {
        // Native form submission is not yet supported
        axios.post(`http://${config.ip}:2000/addKeluhan`,{
          keluhan: this.namaKeluhan
        })
        .then(result =>{
          console.log(this.namaKeluhan)
        })
        .catch(err =>{
          console.log('error')
        })
        console.log('AAAAAA')
      }
    },
    addKelengkapan(){
      if (this.$refs.formAddKelengkapan.validate()) {
        // Native form submission is not yet supported
        axios.post(`http://${config.ip}:2000/addKelengkapan`,{
          kelengkapan: this.namaKelengkapan
        })
        .then(result =>{
          console.log(this.namaKelengkapan)
        })
        .catch(err =>{
          console.log('error')
        })
        console.log('AAAAFF')
      }
    },
    getCurrentDate(){
      let currentdate = new Date(); 
      return currentdate.getDate() + "/"
          + (currentdate.getMonth()+1)  + "/" 
          + currentdate.getFullYear() + " @ "  
          + currentdate.getHours() + ":"  
          + currentdate.getMinutes() + ":" 
          + currentdate.getSeconds()
    },
    submit () {
      if (this.$refs.form.validate() && this.keluhanDipilih.length > 0) {
        // Native form submission is not yet supported
        axios.post(`http://${config.ip}:2000/addKomputer`,{
          idKomputer : this.newId,
          password : this.password,
          namaKomputer : this.namaKomputer,
          noHP : '+62'+this.noHPUser,
          namaMasuk : this.nama,
          tanggalMasuk : this.getCurrentDate(),
          idAdmin : this.idAdmin,
          keluhan : this.keluhanDipilih,
          kelengkapan : this.kelengkapanDipilih
        })
        .then(result =>{
          localStorage.removeItem('@newId')
          localStorage.removeItem('@addPC')
          this.msgDialogT = 'SUCCES'
          this.msgDialog = `${this.newId} Telah Ditambahkan`
          this.dialogAll = true
        })
        .catch(err =>{
          console.log(err)
        })
      }else{
        alert('Keluhan Harus Terisi')
      }
    },
    getSemuaKomputer(){
      let semuaKomputer = axios.get(`http://${config.ip}:2000/semuaKomputer`)
      semuaKomputer
      .then(result =>{
        this.computers = result.data
        console.log(this.computers)
      })
      .then(()=>{
        this.filtered = this.computers
        this.loading = false
      })
    },
    getAdmin(){
      let admin = axios.post(`http://${config.ip}:2000/admin`,{
        idAdmin : this.idAdmin
      })
      admin
      .then(result =>{
        //ini data admin
        this.namaAdmin = result.data[0].nama
        console.log(result.data)
      })
    },
    openPcModal:function(idComputer){
      this.loading = true
      localStorage.setItem('@Komputer', idComputer)
      this.selected = true
    },
    closePcModal:function(){
      this.selected = false
      localStorage.removeItem('@Komputer')
      this.loading = false
    },
    logout: function(){
      this.$emit('logout')
    }
  },
  watch:{
    searchValue: function(newValue){
      this.filtered = this.computers.filter(value => value.idKomputer.match(newValue))
    }
  },
  props: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .hello{
    margin: 0px;
    padding: 0px;
    height: auto;
  }
  ::-webkit-scrollbar {
    /* display: none; */
    position: absolute;
  }
</style>
