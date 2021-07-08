<template>
  <b-row class="min-vh-100" align-v="center">
    <b-col></b-col>
    <b-col cols="12" sm="10" md="8" lg="6" xl="4">

    <b-card>
      <h3>Nouvelle Intervention</h3>
      <b-form>
        <b-form-group label="Date de l'intervention :">
          <b-form-datepicker v-model="form.date" v-bind:min="min" :state="datetimeSelected('date')">
          placeholder="Date de l'intervention"></b-form-datepicker>
          <v-app>
            <v-time-picker :landscape="true" v-model="form.heure" format="24hr" color="#5F3075" :allowed-hours="allowedHours" :allowed-minutes="allowedStep" ></v-time-picker>
          </v-app>
          <b-form-invalid-feedback :state="datetimeSelected('date') && datetimeSelected('heure')">
            <h6>Veuillez préciser la date et l'heure de l'intervention</h6>
          </b-form-invalid-feedback>

        </b-form-group>

        <b-form-group label="Abonné :">
          <b-form-select v-model="form.abonneId" :state="requiredSelect('abonneId')" :options="optionsabonnes"
                         :select-size="4">
          </b-form-select>
          <div>

            <b-button variant="success" to="/intervention/nouvelabonne">
              <b-icon-person-plus-fill></b-icon-person-plus-fill>
              Ajouter un abonné
            </b-button>

            <b-modal id="modal-abonne" title="Nouvel Abonné">
              <Personne></Personne>
            </b-modal>
          </div>
          <b-form-invalid-feedback :state="requiredSelect('abonneId')">
            Veuillez selectionner un abonné
          </b-form-invalid-feedback>

        </b-form-group>
        <b-form-group label="Agent :">
          <b-form-select v-model="form.agentId" :state="requiredSelect('agentId')" :options="optionsagents"
                         :select-size="4">
          </b-form-select>
          <b-form-invalid-feedback :state="requiredSelect('agentId')">
            Veuillez affecter un agent
          </b-form-invalid-feedback>
        </b-form-group>
        <b-form-group label="Type et motif de l'intervention :">
          <b-form-select v-model="form.typeId" :state="requiredSelect('typeId')" :options="optionstypes"
                         :select-size="4">
          </b-form-select>
          <b-form-invalid-feedback :state="requiredSelect('typeId')">
            Veuillez sélectionner un type d'intervention
          </b-form-invalid-feedback>
          <b-form-select v-model="form.motifId" :state="requiredSelect('motifId')" :options="optionsmotifs"
                         :select-size="4">
          </b-form-select>
          <b-form-invalid-feedback :state="requiredSelect('motifId')">
            Veuillez sélectionner un motif d'intervention
          </b-form-invalid-feedback>
        </b-form-group>
        <b-form-group label="Commentaires :">
          <b-form-textarea
              v-model="form.commentaires"
              placeholder="Commentaires"
              rows="4"
              max-rows="4"
          ></b-form-textarea>
        </b-form-group>
        <div>
          <b-button v-on:click="postIntervention" variant="success">
            Créer l'intervention
          </b-button>
        </div>
      </b-form>
    </b-card>
    </b-col>
    <b-col></b-col>

    </b-row>
</template>
<script>
import axios from "axios";
import Personne from "@/components/NouvellePersonne";
import { VApp, VTimePicker } from 'vuetify/lib'

export default {
  name: 'NouvelleIntervention',
  components: {Personne, VApp, VTimePicker},
  methods: {

    postIntervention: function () {
      if (this.datetimeSelected('date') && this.datetimeSelected('heure') && this.requiredSelect('abonneId') && this.requiredSelect('agentId') && this.requiredSelect('typeId') && this.requiredSelect('motifId')) {
        var dateheure = this.form.date + " " + this.form.heure + " UTC";
        axios.post(this.$hostname +'/create/intervention', {
              agentId: this.form.agentId,
              abonneId: this.form.abonneId,
              etatId: this.form.etatId,
              typeId: this.form.typeId,
              motifId: this.form.motifId,
              date: dateheure,
              commentaires: this.form.commentaires
            }
        )
            .then(function (response) {
              console.log(response.status);
              console.log(response);
              if (response.status === 201) {
                return response.data
              }
            }).then(() => {
          this.$socket.emit('ws-refresh-intervention')
          this.$store.dispatch("loadInterventions")
          this.$store.commit("setNotification", "Intervention Créée !")
          this.$router.push( { name: 'visualisation' } );

        }).catch(err => console.log(err))
      }
    },
    enabledHours: function(context) {
      this.ctx = context
      if (context.value === "") {
        this.form.heure = ""
      } else if (context.value <= "07:59:00") {
        this.form.heure = "07:03:00"
        this.form.heure = "08:00:00";
        //
        // context.hours = 8
        // context.minutes = 1
        // context.formatted = "08:00"
        // this.context.value = "08:00:00"
      } else if (context.value >= "18:00:00") {
        this.form.heure = "08:00:00";
        // context.hours = 8
        // context.minutes = 0
        // context.formatted = "08:00"
      }
    },

  allowedStep: function (m){return  m % 15 === 0},
  allowedHours: function (v){return v>= 8 && v <= 18},
  },
  computed: {
    datetimeSelected() {
      return item => this.form[item].length > 0
    },
    requiredSelect() {
      return item => this.form[item] !== 0;
    },
  },
  beforeMount() {
    axios.get(this.$hostname +'/motifs')
        .then(function (response) {
          if (response.status === 200) {
            return response.data
          }
        }).then((data) => {
      for (let i in data) {
        this.optionsmotifs.push({value: data[i].id, text: data[i].motif})
      }
    }).catch(err => console.log(err))

    axios.get(this.$hostname +'/agents')
        .then(function (response) {
          if (response.status === 200) {
            return response.data
          }
        }).then((data) => {
      for (let i in data) {
        this.optionsagents.push({value: data[i].id, text: data[i].nom})
      }
    }).catch(err => console.log(err))

    axios.get(this.$hostname +'/types')
        .then(function (response) {
          if (response.status === 200) {
            return response.data
          }
        }).then((data) => {
      for (let i in data) {
        this.optionstypes.push({value: data[i].id, text: data[i].type})
      }
    }).catch(err => console.log(err))

    axios.get(this.$hostname +'/personnes')
        .then(function (response) {
          if (response.status === 200) {
            return response.data
          }
        }).then((data) => {
      for (let i in data) {
        this.optionsabonnes.push({value: data[i].abonneId, text: data[i].nom + " " + data[i].prenom})
      }
    }).catch(err => console.log(err))
  },
  mounted() {
  },


  data() {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const minDate = today;
    const maxDate = new Date(today)
    maxDate.setMonth(maxDate.getMonth() + 1)
    return {
      optionsabonnes: [],
      optionsagents: [],
      optionsmotifs: [],
      optionstypes: [],
      min: minDate,
      timepickercolor: "danger",
      form: {
        motifId: 0,
        typeId: 0,
        etatId: 0,
        abonneId: 0,
        agentId: 0,
        date: "",
        heure: "",
        commentaires: "",
      },
    }
  }
}
// TODO: Ajouter un filtre sur les abonnes + filtrer le type en fonction du motif selectionné

</script>

