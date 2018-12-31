<template>
    <v-card color="white" :style="{ margin:'10px', width:'340px', }">    
        <v-card-title :style="{'font-weight':'bold'} " ><v-icon large :style="{margin:'5px', 'font-weight':'bold'} " right>computer</v-icon>{{idComputer}}</v-card-title>
        <v-divider></v-divider>
        <v-card-text v-if="tanggalDikerjakan != 'cancel'" :style="{'text-align':'left'}">
            <v-chip :style="{width:'95%'}" label color="pink lighten-1" text-color="white">
                <v-icon left>label</v-icon>Masuk : {{tanggalMasuk}}
            </v-chip>
            <v-chip :style="{width:'95%'}" v-if="(tanggalValidasi != null && tanggalValidasi != '')" label color="pink darken-1" text-color="white">
                <v-icon left>assignment_turned_in</v-icon>Validasi : {{tanggalValidasi}}
            </v-chip>
            <v-chip :style="{width:'95%'}" v-if="(tanggalDikerjakan != null && tanggalDikerjakan != '')" label color="pink darken-2" text-color="white">
                <v-icon left>build</v-icon>Dikerjakan : {{tanggalDikerjakan}}
            </v-chip>
            <v-chip :style="{width:'95%'}" v-if="(tanggalSelesai != null && tanggalDikerjakan != '')" label color="green darken-3" text-color="white">
                <v-icon left>check_circle</v-icon>Selesai : {{tanggalSelesai}}
            </v-chip>
            <v-chip :style="{width:'95%'}" v-if="(tanggalKeluar != null && tanggalDikerjakan != '')" label color="teal darken-4" text-color="white">
                <v-icon left>shopping_cart</v-icon>Diambil : {{tanggalKeluar}}
            </v-chip>
        </v-card-text>
        <v-card-text v-if="tanggalDikerjakan == 'cancel'" :style="{'text-align':'left'}">
            <v-chip :style="{width:'95%'}" label color="pink lighten-1" text-color="white">
                <v-icon left>label</v-icon>Masuk : {{tanggalMasuk}}
            </v-chip>
            <v-chip :style="{width:'95%'}" v-if="(tanggalValidasi != null)" label color="red darken-4" text-color="white">
                <v-icon left>cancel</v-icon>Dibatalkan : {{tanggalValidasi}}
            </v-chip>
            <v-chip :style="{width:'95%'}" v-if="(tanggalKeluar != null && tanggalDikerjakan != '')" label color="teal darken-4" text-color="white">
                <v-icon left>shopping_cart</v-icon>Diambil : {{tanggalKeluar}}
            </v-chip>
        </v-card-text>
        <v-btn @click="details" :id="idComputer" :style="{'margin-bottom':'20px'}" dark color="pink darken-4">
            View Details
            <v-icon right dark>search</v-icon>
        </v-btn>
    </v-card>
</template>

<script>
export default {
  name: 'CardPC',
  props: ['idComputer', 'tanggalMasuk', 'tanggalValidasi', 'tanggalDikerjakan', 'tanggalSelesai', 'tanggalKeluar'],
  methods:{
      details(){
            this.$emit('viewDetails', this.idComputer)
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
