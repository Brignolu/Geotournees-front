<template>
  <div class="d-flex flex-column min-vh-100 justify-content-center align-items-center">
    <b-card class="text-center col-4">
      <img class="col-3" src="@/assets/Logo_Haute_Savoie.png"/>
      <h3>Visualisation des Tournées</h3>
      <h4>Service TéléAlarme</h4>
      <b-form>
        <b-form-group
            id="input-group-1"
            label="Identification:"
            label-for="input-1"
        >
          <b-form-input
              id="input-1"
              v-model="form.nom_utilisateur"
              type="text"
              placeholder="Identifiant"
              :state="this.erreur"
              required
              class="text-center"
          ></b-form-input>

        </b-form-group>
        <b-form-group>
          <b-form-input
              id="input-2"
              v-model="form.password"
              placeholder="Mot de passe"
              type="password"
              class="text-center"
              :state="this.erreur"
              required
          ></b-form-input>
          <b-form-invalid-feedback :state="this.messageErreur === null">
            {{ messageErreur }}
          </b-form-invalid-feedback>
        </b-form-group>

        <b-button v-on:click="postLogin" variant="success">
          Envoyer
        </b-button>

        <div>


        </div>

      </b-form>
    </b-card>
  </div>
</template>
<script>

import axios from "axios"

export default {
  name: 'Login',
  methods: {
    postLogin: function () {
      axios.post('http://localhost:3000/login', {
        nom_utilisateur: this.form.nom_utilisateur,
        mot_de_passe: this.form.password
      })
          .then(function (value) {
            return value.data;
          }).then(data => {
        if (data.success) {
          // emission de l'event sur le socket vers le serveur
          this.$socket.emit('connexion', this.form.nom_utilisateur)
          this.$socket.emit('connexion', this.form.password)
          this.$store.commit("login", data);
          this.$store.commit('initdatalist')
          this.$router.push({name: 'visualisation'});
        } else {

          this.erreur = false
          this.messageErreur = data.etat;
        }
      }).catch(err => console.log(err));
    }
  },
  data() {
    return {
      form: {
        nom_utilisateur: "",
        password: ""
      },
      erreur: null,
      messageErreur: null,
    }
  }
}
</script>