<template>
  <div class="d-flex flex-column min-vh-100 justify-content-center align-items-center">
    <b-card>
      <b-form>
        <b-form-group
            label="Nom :"
            label-for="input-1"
        >
          <b-form-input
              v-model="form.nom"
              type="text"
              placeholder="Nom"
              required
          ></b-form-input>
        </b-form-group>

        <b-form-group
            label="Nom d'utilisateur : "
            label-for="input-1"
        >
          <b-form-input

              v-model="form.nom_utilisateur"
              type="text"
              placeholder="Nom d'utilisateur"
              required
          ></b-form-input>
        </b-form-group>

        <b-form-group id="input-group-2" label="Mot de Passe :" label-for="input-2">
          <b-form-input
              v-model="form.mot_de_passe"
              placeholder="Mot de passe"
              type="text"
              required
          ></b-form-input>
        </b-form-group>
        <b-form-group id="input-group-2" label="Status :" label-for="input-2">
          <b-form-select v-model="form.statusId" :options="options" :select-size="4">
          </b-form-select>
        </b-form-group>
        <div>
          <b-button v-on:click="postUtilisateur" variant="success">
            Ajouter l'utilisateur
          </b-button>
        </div>
      </b-form>
    </b-card>
  </div>
</template>
<script>
import axios from "axios";

export default {
  name: 'Utilisateur',
  props: ['statut'],
  methods: {
    postUtilisateur: function () {
      axios.post('http://localhost:3000/create/utilisateur', {
            nom: this.form.nom,
            nom_utilisateur: this.form.nom_utilisateur,
            mot_de_passe: this.form.mot_de_passe,
            statusId: this.form.statusId
          }
      )
          .then(function (response) {
            console.log(response.status);
            console.log(response);
            if (response.status === 201) {
              return response.data
            }
          }).then(() => {
        this.$router.push({name: 'visualisation'});
      }).catch(err => console.log(err))
    }

  },
  computed: {
    emptyText() {
      return this.form.nom_utilisateur.length > 2 ? true : false
    }
  },
  data() {
    return {
      form: {
        nom: "",
        nom_utilisateur: "",
        mot_de_passe: "",
        statusId: 0
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