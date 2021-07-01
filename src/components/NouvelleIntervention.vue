<template>
  <b-row class="min-vh-100" align-v="center">
    <b-col></b-col>
    <b-col cols="12" sm="10" md="8" lg="6" xl="4">

    <b-card>
      <h3>Nouvelle Intervention</h3>
      <b-form>
        <b-form-group label="Date et Heure de l'intervention :">
          <b-form-datepicker id="example-datepicker" v-model="form.date" :state="datetimeSelected('date')"
          placeholder="Date de l'intervention"></b-form-datepicker>
          <b-form-timepicker v-model="form.heure" :state="datetimeSelected('heure')" locale="fr" placeholder="Horaire de l'intervention"></b-form-timepicker>
          <b-form-invalid-feedback :state="datetimeSelected('date') && datetimeSelected('heure')">
            Veuillez préciser la date et l'heure de l'intervention
          </b-form-invalid-feedback>
        </b-form-group>
        <b-form-group label="Abonné :">
          <b-form-select v-model="form.abonneId" :state="requiredSelect('abonneId')" :options="optionsabonnes"
                         :select-size="4">
          </b-form-select>
          <b-form-invalid-feedback :state="requiredSelect('abonneId')">
            Veuillez selectionner un abonné
          </b-form-invalid-feedback>
          <div>
            <b-button variant="success" to="/intervention/nouvelabonne">
              <b-icon-person-plus-fill></b-icon-person-plus-fill>
              Ajouter un abonné
            </b-button>

            <b-modal id="modal-abonne" title="Nouvel Abonné">
              <Personne></Personne>
            </b-modal>
          </div>
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

export default {
  name: 'NouvelleIntervention',
  components: {Personne},
  methods: {
    postIntervention: function () {
      if (this.datetimeSelected('date') && this.datetimeSelected('heure') && this.requiredSelect('abonneId') && this.requiredSelect('agentId') && this.requiredSelect('typeId') && this.requiredSelect('motifId')) {
        var dateheure = this.form.date + " " + this.form.heure + " UTC";
        axios.post('http://localhost:3000/create/intervention', {
              agentId: this.form.agentId,
              abonneId: this.form.abonneId,
              etatId: this.form.etatId,
              typeId: this.form.typeId,
              motifId: this.form.motifId,
              date: dateheure
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
          this.$store.commit("updatedatalist")
          this.$store.commit("messagecreate", "Intervention Créée !")
          this.$router.push( { name: 'visualisation' } );

        }).catch(err => console.log(err))
      }
    }
  },
  computed: {
    datetimeSelected() {
      return item => this.form[item].length > 0
    },
    requiredSelect() {
      return item => this.form[item] != 0;
    }
  },
  beforeMount() {


    axios.get('http://localhost:3000/motifs')
        .then(function (response) {
          if (response.status === 200) {
            return response.data
          }
        }).then((data) => {
      for (let i in data) {
        this.optionsmotifs.push({value: data[i].id, text: data[i].motif})
      }
    }).catch(err => console.log(err))

    axios.get('http://localhost:3000/agents')
        .then(function (response) {
          if (response.status === 200) {
            return response.data
          }
        }).then((data) => {
      for (let i in data) {
        this.optionsagents.push({value: data[i].id, text: data[i].nom})
      }
    }).catch(err => console.log(err))

    axios.get('http://localhost:3000/types')
        .then(function (response) {
          if (response.status === 200) {
            return response.data
          }
        }).then((data) => {
      for (let i in data) {
        this.optionstypes.push({value: data[i].id, text: data[i].type})
      }
    }).catch(err => console.log(err))

    axios.get('http://localhost:3000/personnes')
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
    return {
      optionsabonnes: [],
      optionsagents: [],
      optionsmotifs: [],
      optionstypes: [],
      form: {
        motifId: 0,
        typeId: 0,
        etatId: 0,
        abonneId: 0,
        agentId: 0,
        date: "",
        heure: ""

      },
    }
  }
}
</script>