<template>
  <div class="d-flex flex-column min-vh-100 justify-content-center align-items-center">
    <b-row>
      <b-col>
        <b-card>
          <b-form>
            <b-form-datepicker id="example-datepicker" v-model="form.date" class="mb-2"></b-form-datepicker>
            <b-form-timepicker v-model="form.heure" locale="fr"></b-form-timepicker>
            <b-form-select v-model="form.abonneId" :options="optionsabonnes" :select-size="4">
            </b-form-select>
            <b-form-select v-model="form.agentId" :options="optionsagents" :select-size="4">
            </b-form-select>
            <b-form-select v-model="form.typeId" :options="optionstypes" :select-size="4">
            </b-form-select>
            <b-form-select v-model="form.motifId" :options="optionsmotifs" :select-size="4">
            </b-form-select>
            <div>
              <b-button v-on:click="postIntervention" variant="success">
                Créer l'intervention
              </b-button>
            </div>
          </b-form>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>
<script>
import axios from "axios";

export default {
  name: 'Intervention',
  methods: {
    postIntervention: function () {
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
        this.$bvToast.toast(`Intervention Créée !`, {
          title: 'Intervention',
          autoHideDelay: 5000,
          appendToast: false
        })

        // this.$router.push({name: 'visualisation'});
      }).catch(err => console.log(err))
    }
  },
  beforeMount() {

    axios.get('http://localhost:3000/motifs')
        .then(function (response) {
          if (response.status === 200) {
            return response.data
          }
        }).then((data) => {
      for (var i in data) {
        this.optionsmotifs.push({value: data[i].id, text: data[i].motif})
      }
    }).catch(err => console.log(err))

    axios.get('http://localhost:3000/agents')
        .then(function (response) {
          if (response.status === 200) {
            return response.data
          }
        }).then((data) => {
      for (var i in data) {
        this.optionsagents.push({value: data[i].id, text: data[i].nom})
      }
    }).catch(err => console.log(err))

    axios.get('http://localhost:3000/types')
        .then(function (response) {
          if (response.status === 200) {
            return response.data
          }
        }).then((data) => {
      for (var i in data) {
        this.optionstypes.push({value: data[i].id, text: data[i].type})
      }
    }).catch(err => console.log(err))

    axios.get('http://localhost:3000/personnes')
        .then(function (response) {
          if (response.status === 200) {
            return response.data
          }
        }).then((data) => {
      for (var i in data) {
        this.optionsabonnes.push({value: data[i].abonneId, text: data[i].nom + " " + data[i].prenom})
      }
    }).catch(err => console.log(err))
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