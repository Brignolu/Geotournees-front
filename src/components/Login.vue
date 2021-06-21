<template>
  <div class="d-flex flex-column min-vh-100 justify-content-center align-items-center">
    <b-card class="text-center col-4">
      <b-form>
        <b-form-group
            id="input-group-1"
            label="Nom Utilisateur :"
            label-for="input-1"
        >
          <b-form-input
              id="input-1"
              v-model="form.nom_utilisateur"
              type="text"
              placeholder="Nom Utilisateur"
              required
              class="text-center"
          ></b-form-input>
        </b-form-group>

        <b-form-group id="input-group-2" label="Mot de passe" label-for="input-2">
          <b-form-input
              id="input-2"
              v-model="form.password"
              placeholder="Mot de passe"
              type="password"
              class="text-center"
              required
          ></b-form-input>
        </b-form-group>

        <b-button v-on:click="postLogin" variant="success">
          Envoyer
        </b-button>

        <div>
          {{ utilisateur }}
        </div>

      </b-form>
    </b-card>
  </div>
</template>
<script>

import axios from "axios"

export default {
  name: 'Login',
  props: ['utilisateur'],
  methods: {
    postLogin: function () {
      axios.post('http://localhost:3000/login', {
        nom_utilisateur: this.form.nom_utilisateur,
        mot_de_passe: this.form.password
      })
          .then(function (value) {
            return value.data;
          }).then(data => {
        this.utilisateur = data;
        if (data.success) {
          this.$store.commit("login", data);
          this.$router.push({name: 'visualisation'});
        } else {
          this.utilisateur = data.etat;
        }
      }).catch(err => console.log(err));

    }
  },
  data() {
    return {
      form: {
        nom_utilisateur: "",
        password: ""
      }
    }
  }
}
</script>