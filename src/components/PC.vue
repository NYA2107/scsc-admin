<template>
    <v-dialog v-model="pcModal" fullscreen hide-overlay transition="dialog-bottom-transition">
        <v-dialog v-model="dialogAll" persistent max-width="290">
          <v-card>
            <v-card-title class="headline">{{msgDialogT}}</v-card-title>
            <v-card-text>{{msgDialog}}</v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="green darken-1" flat @click="dialogAll = false">Close</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-card :style="{width:'100vw', height:'100vh'}">
            <v-dialog v-model="dialogError">
                <v-card>
                    <v-card-title primary-title>
                        <div class="title">Submit Error</div>
                    </v-card-title>
                    <v-card-text>
                        <p>{{errorMsg}}</p>
                        <v-btn @click="closeDialogError" color="secondary">Close</v-btn>
                    </v-card-text>
                </v-card>
            </v-dialog>
            <v-dialog v-if="detailKomputer && !loading" v-model="dialogDiambil">
                <v-card>
                    <v-card-title primary-title>
                        <div class="title">Ambil Komputer</div>
                    </v-card-title>
                    <v-card-text>
                        <v-text-field
                          v-model="namaKeluar"
                          label="Nama Pengambil"
                          required
                        ></v-text-field>
                        <v-btn @click="closeDiambil" color="secondary">Close</v-btn>
                        <v-btn @click="submitDiambil" color="primary">Submit</v-btn>
                    </v-card-text>
                </v-card>
            </v-dialog>
            <v-toolbar fixed dark color="pink darken-1">
                <v-btn icon dark @click="closeModal">
                    <v-icon>close</v-icon>
                </v-btn>
                <v-toolbar-title>Computer</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items>
                    <v-btn dark flat @click="dialog = false">Save</v-btn>
                </v-toolbar-items>
            </v-toolbar>
            <v-card  color="pink lighten-4" :style="{width:'100vw',padding:'20px','padding-top':'60px'}">
                <v-progress-linear color="pink" v-if="loading == true" :indeterminate="true"></v-progress-linear>
                <!-- Info User -->
                <v-card v-if="detailKomputer != null && loading == false"  :style="{width:'100%',padding:'20px','background-color':'#FCE4EC'}">
                    <v-card-title primary-title>
                        
                        <div :style="{width:'100%','background-color': 'white',padding:'20px'}">

                            <div class="title"><v-icon :style="{'margin-right':'10px'}" large>computer</v-icon>{{selected}}</div>
                            <div :style="{width:'100%','margin-top':'20px'}" class="grey--text">Nama Masuk: {{detailKomputer[0].namaMasuk}}</div>
                            <div :style="{width:'100%','margin-top':'10px'}" class="grey--text">Nama Komputer: {{detailKomputer[0].namaKomputer}}</div>
                            <div :style="{width:'100%','margin-top':'10px'}" class="grey--text">No HP : {{detailKomputer[0].noHPMasuk}}</div>
                            <v-form ref="form" v-model="valid" lazy-validation>
                                <v-text-field
                                    v-model="password"
                                    :rules="passwordRules"
                                    :counter="20"
                                    label="Password"
                                    type="password"
                                    required
                                ></v-text-field>
                                <v-btn 
                                    :loading="loading"
                                    :disabled="loading"
                                    color="secondary"
                                    @click="setPassword"
                                >
                                    Ganti Password
                                </v-btn>
                            </v-form>
                        </div>
                        <v-timeline :style="{width:'100%'}">
                            <!-- Masuk -->
                            <v-timeline-item color="pink" icon="label" fill-dot>
                                <span class="title" :style="{color:'#E91E63'}" slot="opposite">{{detailKomputer[0].tanggalMasuk}}</span>
                                <v-card color="pink" dark>
                                    <v-card-title class="title" >Masuk</v-card-title>
                                    <v-card-text class="white text--primary">
                                        <v-card-title primary-title>
                                            Admin : {{detailKomputer[0].namaAdmin}}
                                            <div :style="{width:'100%'}" class="grey--text">CP : {{detailKomputer[0].noHPAdmin}}</div>
                                        </v-card-title>

                                        <div v-if="detailKomputer[0].keluhan != null && detailKomputer[0].keluhan != ''" :style="{'background-color':'#FCE4EC',padding:'10px'}">
                                            <h2 :style="{'text-align':'center',margin:'5px','background-color':'#D81B60',color:'white'}">Keluhan</h2>
                                            <div :style="{color:'white','background-color':'#EC407A',margin:'5px',padding:'5px'}"" v-for="keluhan in detailKomputer[0].keluhan">
                                                {{keluhan.keluhan}}
                                            </div>
                                        </div>
                                        <div v-if="detailKomputer[0].kelengkapan != null && detailKomputer[0].kelengkapan != ''" :style="{'background-color':'#FCE4EC',padding:'10px','margin-top':'10px'}">
                                            <h2 :style="{'text-align':'center',margin:'5px','background-color':'#D81B60',color:'white'}">Kelengkapan</h2>
                                            <div :style="{color:'white','background-color':'#EC407A',margin:'5px',padding:'5px'}"" v-for="kelengkapan in detailKomputer[0].kelengkapan">
                                                {{kelengkapan.kelengkapan}}
                                            </div>
                                        </div>
                                    </v-card-text>
                                </v-card>
                            </v-timeline-item>
                            <!-- Validasi -->
                            <v-timeline-item v-if="detailKomputer[1].tanggalValidasi && detailKomputer[2].tanggalDikerjakan != 'cancel'" color="purple" icon="assignment_turned_in" fill-dot>
                                <span class="title" :style="{color:'#9C27B0'}" slot="opposite">{{detailKomputer[1].tanggalValidasi}}</span>
                                <v-card color="purple" dark>
                                    <v-card-title class="title">Validasi</v-card-title>
                                    <v-card-text class="white text--primary">
                                        <v-card-title primary-title>
                                            Teknisi : {{detailKomputer[1].namaTeknisi}}
                                            <div :style="{width:'100%'}" class="grey--text">CP : {{detailKomputer[1].noHPTeknisi}}</div>
                                        </v-card-title>
                                        <v-card-title v-if="detailKomputer[1].catatanTeknisi" primary-title>
                                            Catatan Teknisi :
                                            <div :style="{'margin-top':'10px',padding:'10px', 'background-color':'#F3E5F5'}">
                                                {{detailKomputer[1].catatanTeknisi}}
                                            </div>
                                        </v-card-title>
                                        <div :style="{
                                            padding:'15px',
                                            margin:'15px',
                                            'background-color':'#8E24AA',
                                            color:'white'
                                        }">
                                            
                                            <h2 :style="{'text-align':'center','margin-bottom':'10px'}">Issue</h2>
                                            <v-expansion-panel
                                              v-model="issuePanel"
                                              expand
                                              light
                                            >
                                              <v-expansion-panel-content
                                                v-for="(issue,i) in detailKomputer[1].issueSolusi"
                                                :key="i"
                                                :style="{'background-color':'#E1BEE7'}"
                                              >
                                                <div slot="header"> 
                                                    <v-chip :color="issueWarnColor[issue.warnLevel]" text-color="white">
                                                        <v-avatar>
                                                            <v-icon>error</v-icon>
                                                        </v-avatar>
                                                        {{issue.issue}}
                                                    </v-chip></div>
                                                <div :style="{margin:'10px'}">                               
                                                    <div 
                                                        :style="{
                                                            'border-radius':'2px',
                                                            margin:'5px',
                                                            'background-color':'#E1BEE7',
                                                            padding:'5px'
                                                        }" 
                                                        v-for="(solusi,i) in issue.solusi"
                                                    >
                                                    <v-badge :style="{width:'100%'}" v-model="solusi.choosen" color="teal" overlap>
                                                        <div :style="{color:'#4A148C',padding:'10px',margin:'px','background-color':'#F3E5F5'}">   
                                                            {{solusi.solusi}}
                                                            <br/>
                                                            <v-chip outline label color="purple" >
                                                              <v-icon left>payment</v-icon>Rp. {{solusi.harga}}
                                                            </v-chip>
                                                        </div>  
                                                        <v-icon dark slot="badge">check_circle</v-icon>                 
                                                    </v-badge>                                 
                                                    </div>
                                                </div>
                                              </v-expansion-panel-content>
                                            </v-expansion-panel>
                                            <v-chip :style="{'margin-top':'20px'}" outline label color="white" >
                                              <v-icon left>payment</v-icon>Total Biaya : Rp. {{detailKomputer[1].totalBiaya}} 
                                            </v-chip>
                                        </div>
                                    </v-card-text>
                                </v-card>
                            </v-timeline-item>
                            <!-- Dikerjakan -->
                            <v-timeline-item v-if="detailKomputer[2].tanggalDikerjakan && detailKomputer[2].tanggalDikerjakan != 'cancel'" color="yellow darken-3" icon="build" fill-dot>
                                <span class="title" :style="{color:'#F57F17'}" slot="opposite">{{detailKomputer[2].tanggalDikerjakan}}</span>
                                <v-card color="yellow darken-3" dark>
                                    <v-card-title class="title">Dikerjakan</v-card-title>
                                    <v-card-text class="white text--primary">
                                       <div :style="{
                                            padding:'15px',
                                            margin:'15px',
                                            'background-color':'#FFF9C4',
                                            color:'#F57F17'
                                        }">
                                            
                                            <h2 :style="{'text-align':'center','margin-bottom':'10px'}">Solusi</h2>
                                            <div 
                                                :style="{ 
                                                padding:'15px',
                                                'margin-top':'15px',
                                                'background-color':'#F57F17',
                                                color:'white'
                                                }" 
                                                v-for="solusi in detailKomputer[2].solusiDikerjakan"
                                            >
                                                {{solusi.solusi}}
                                                <v-chip outline label color="yellow lighten-4" >
                                                  <v-icon left>payment</v-icon>Rp. {{solusi.harga}}
                                                </v-chip>
                                            </div>
                                            <v-chip :style="{'margin-top':'20px'}" outline label color="yellow darken-4" >
                                              <v-icon left>payment</v-icon>Total Biaya : Rp. {{detailKomputer[2].totalBiaya}} 
                                            </v-chip>
                                        </div>
                                    </v-card-text>
                                </v-card>
                            </v-timeline-item>
                            <!-- Selesai -->
                            <v-timeline-item v-if="detailKomputer[3].tanggalSelesai && detailKomputer[2].tanggalDikerjakan != 'cancel'" color="green" icon="check_circle" fill-dot>
                                <span class="title" :style="{color:'#4CAF50'}" slot="opposite">{{detailKomputer[3].tanggalSelesai}}</span>
                                <v-card color="green" dark>
                                    <v-card-title class="title">Selesai</v-card-title>
                                    <v-card-text class="white text--primary">
                                        <p :style="{'margin-top':'20px'}">Solusi Dikerjakan : </p>
                                         <v-data-table
                                            :items="detailKomputer[3].solusiDikerjakan"
                                            class="elevation-1"
                                            :headers="headersSolusi"
                                            hide-actions
                                            light
                                          >
                                            <template slot="items" slot-scope="props">
                                              <td>{{ props.item.solusi }}</td>
                                              <td class="text-xs-right">{{ props.item.harga }}</td>
                                              
                                            </template>
                                          </v-data-table>
                                          <p :style="{'margin-top':'20px'}">Biaya Tambahan : </p>
                                          <v-data-table
                                            v-if="detailKomputer[3].biayaTambahan"    
                                            :items="detailKomputer[3].biayaTambahan"
                                            class="elevation-1"
                                            :headers="headersBiayaTambahan"
                                            hide-actions
                                            light
                                          >
                                            <template slot="items" slot-scope="props">
                                              <td>{{ props.item.tambahan }}</td>
                                              <td class="text-xs-right">{{ props.item.harga }}</td>
                                              
                                            </template>
                                          </v-data-table>
                                        <v-chip :style="{'margin-top':'20px'}" outline label color="green darken-4" >
                                            <v-icon left>payment</v-icon>Total Biaya : Rp. {{detailKomputer[3].totalBiaya}} 
                                        </v-chip>
                                        <v-btn 
                                            v-if="!detailKomputer[4].tanggalKeluar"
                                            @click="openDiambil"
                                            :style="{'margin-top':'20px'}"
                                            :loading="loading"
                                            :disabled="loading"
                                            color="green"
                                        >
                                            Ubah Status Diambil
                                        </v-btn>
                                    </v-card-text>
                                </v-card>
                            </v-timeline-item>
                            <!-- Cancel -->
                             <v-timeline-item v-if="detailKomputer[2].tanggalDikerjakan == 'cancel'" color="red" icon="cancel" fill-dot>
                                <span class="title" :style="{color:'#F44336'}" slot="opposite">{{detailKomputer[1].tanggalValidasi}}</span>
                                <v-card color="red" dark>
                                    <v-card-title class="title">Dibatalkan</v-card-title>
                                    <v-card-text class="white text--primary">
                                        <div  :style="{ 
                                                padding:'15px',
                                                'margin-top':'15px',
                                                'background-color':'#FFCDD2',
                                                color:'#B71C1C'
                                                }" >
                                            Service Dibatalkan
                                        </div>
                                        <v-btn 
                                            v-if="!detailKomputer[4].tanggalKeluar"
                                            @click="openDiambil"
                                            :style="{'margin-top':'20px'}"
                                            :loading="loading"
                                            :disabled="loading"
                                            color="red"
                                        >
                                            Ubah Status Diambil
                                        </v-btn>
                                    </v-card-text>
                                </v-card>
                            </v-timeline-item>
                            <!-- Diambil -->
                            <v-timeline-item v-if="detailKomputer[4].tanggalKeluar" color="teal" icon="shopping_cart" fill-dot>
                                <span class="title" :style="{color:'#009688'}" slot="opposite">{{detailKomputer[4].tanggalKeluar}}</span>
                                <v-card color="teal" dark>
                                    <v-card-title class="title">Diambil</v-card-title>
                                    <v-card-text class="white text--primary">
                                        <p>Diambil Oleh : </p>
                                        <div  :style="{ 
                                                padding:'15px',
                                                'margin-top':'15px',
                                                'background-color':'#E0F2F1',
                                                color:'#004D40'
                                                }" >
                                            {{detailKomputer[4].namaKeluar}}
                                        </div>
                                    </v-card-text>
                                </v-card>
                            </v-timeline-item>
                        </v-timeline>
                    </v-card-title>
                </v-card>
            </v-card>
        </v-card>
        
    </v-dialog>
</template>

<script>
import axios from 'axios'
import config from '../config.js'
export default {
  name: 'PC',
  data: ()=>({
        dialogAll:false,
        msgDialogT:'',
        msgDialog:'',
        valid: true,
        password:'',
        passwordRules: [
          v => !!v || 'Password is required',
          v => (v && v.length <= 20) || 'Name must be less than 10 characters'
        ],
        dialogError:false,
        errorMsg:'',
        namaKeluar:'',
        selected:null,
        pcModal:false,
        dialogDiambil:false,
        succesDiambil:false,
        issuePanel:[],
        issueWarnColor:['green','yellow darken-3','red'],
        loading:true,
        detailKomputer:null,
        headersSolusi: [
          {
            text: 'Solusi',
            align: 'left',
            sortable: false,
            value: 'solusi'
          },
          { text: 'Harga',align: 'right', sortable: false, value: 'harga' },
        ],
        headersBiayaTambahan: [
          {
            text: 'Tambahan',
            align: 'left',
            sortable: false,
            value: 'tambahan'
          },
          { text: 'Harga',align: 'right', sortable: false, value: 'harga' },
        ],
  }),
  created(){
        if(!localStorage.getItem('@Komputer')){
            this.pcModal = false
        }else{
            this.pcModal = true
            this.selected = localStorage.getItem('@Komputer')

            this._fetch()
        }
  },
  methods:{
    setPassword(){
        if(this.$refs.form.validate()){
            axios.post(`http://${config.ip}:2000/setPassword`,{
                idKomputer: localStorage.getItem('@Komputer'),
                password : this.password
            }).then(result =>{
                this.msgDialogT = 'SUCCES'
                this.msgDialog = 'Password komputer telah diganti'
                this.dialogAll = true   
            })
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
    openDiambil(){
    this.dialogDiambil = true
    },
    closeDiambil(){
    this.dialogDiambil = false
    },
    submitDiambil(){
    if(this.namaKeluar != '' && this.namaKeluar != undefined && this.namaKeluar != null && this.namaKeluar.length <= 50){
        axios.post(`http://${config.ip}:2000/ambilKomputer`,{
            idKomputer : localStorage.getItem('@Komputer'),
            namaKeluar : this.namaKeluar,
            tanggalKeluar : this.getCurrentDate()
        })
        .then(result =>{
            this.loading = true
            this.dialogDiambil = false
            window.location.reload()
        })
        .catch(error =>{
            this.dialogError = true
        })
    }else if(this.namaKeluar == ''){
        this.errorMsg = 'Semua field harus terisi'
        this.dialogError = true
    }else if(this.namaKeluar.length > 50){
        this.errorMsg = 'Nama Terlalu Panjang'
        this.dialogError = true
    }else{
        this.errorMsg = 'Submit gagal'
        this.dialogError = true
    }

    },
    closeModal(){
        this.$emit('closeModal')
    },
    closeDialogError(){
        this.dialogError = false
    },
    _fetch(){
        let dataKomputer = axios.post(`http://${config.ip}:2000/komputerDetail`,{
            idKomputer: localStorage.getItem('@Komputer')
        })  
        dataKomputer
        .then(result =>{
            this.detailKomputer = result.data
        })
        .then(()=>{
            if(this.detailKomputer[4].namaKeluar){
                this.namaKeluar = this.detailKomputer[4].namaKeluar    
            }
            this.loading = false
        })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
