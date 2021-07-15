<template>
  <b-row class="min-vh-100" align-v="center">
    <b-col></b-col>
    <b-col cols="12" sm="10" md="8" lg="6" xl="4">
    <b-card>
      <b-form>
        <b-form-group
            label="Informations:"
        >
          <b-form-input
              v-model="form.nom"
              type="text"
              placeholder="Nom"
          ></b-form-input>
        </b-form-group>

        <b-form-group
            label="Identifiants:"
        >

          <b-form-input
              v-model="form.nom_utilisateur"
              type="text"
              placeholder="Nom d'utilisateur"
              :state="betweenSixTwelve('nom_utilisateur')"
              required
          ></b-form-input>

          <b-form-invalid-feedback :state="betweenSixTwelve('nom_utilisateur')">
            Votre nom d'utilisateur doit comprendre entre 6 et 12 caractères
          </b-form-invalid-feedback>

          <b-form-input
              v-model="form.mot_de_passe"
              placeholder="Mot de passe"
              type="password"
              :state="betweenSixTwelve('mot_de_passe')"
              required
          ></b-form-input>

          <b-form-invalid-feedback :state="betweenSixTwelve('mot_de_passe')">
            Votre mot de passe doit comprendre entre 6 et 12 caractères
          </b-form-invalid-feedback>

        </b-form-group>
        <b-form-group id="input-group-2" label="Statut:">
          <b-form-select v-model="form.statusId" :options="options" :state="requiredStatus" :select-size="4">
          </b-form-select>
          <b-form-invalid-feedback :state="betweenSixTwelve('mot_de_passe')">
            Veuillez sélectionner un statut
          </b-form-invalid-feedback>
        </b-form-group>

        <div>
          <b-button v-on:click="postUtilisateur" variant="success">Ajouter</b-button>
        </div>

      </b-form>
    </b-card>
    </b-col>
    <b-col></b-col>

  </b-row>
</template>
<script>
import axios from "axios";

export default {
  name: 'NouvelUtilisateur',
  methods: {
    postUtilisateur: function () {
      if (this.betweenSixTwelve('nom_utilisateur') && this.betweenSixTwelve('mot_de_passe') && this.requiredStatus) {
        axios.post(this.$hostname +'/create/utilisateur', {
              nom: this.form.nom,
              nom_utilisateur: this.form.nom_utilisateur,
              mot_de_passe: this.form.mot_de_passe,
              statusId: this.form.statusId
            }
        )
            .then(function (response) {
              // console.log(response.status);
              // console.log(response);
              if (response.status === 201) {
                return response.data
              }
            }).then(() => {
          this.$router.push({name: 'visualisation'});
        }).catch(err => console.log(err))
      }
    },
    onreset(event) {
      event.preventDefault()
      this.form.nom = '';
      this.form.nom_utilisateur = '';
      this.form.mot_de_passe = '';
      this.form.statusId = null;
    }

  },
  computed: {
    betweenSixTwelve() {
      return item => this.form[item].length >= 6 && this.form.nom_utilisateur.length <= 12
    },
    requiredStatus() {
      return this.form.statusId != null;
    }

  },
  data() {
    return {
      form: {
        nom: "",
        nom_utilisateur: "",
        mot_de_passe: "",
        statusId: null
      },

      options: [
        {value: 1, text: 'Utilisateur'},
        {value: 2, text: 'Modérateur'},
        {value: 3, text: 'Administrateur'}
      ]
    }
  }
}
</script>