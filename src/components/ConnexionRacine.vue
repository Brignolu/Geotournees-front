<template>
    <b-row class="min-vh-100" align-v="center">
      <b-col></b-col>
      <b-col cols="12" sm="10" md="8" lg="6" xl="4">
        <b-card class="text-center">
          <img class="col-6" src="@/assets/Logo_Haute_Savoie.png"/>
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
      </b-col>
      <b-col></b-col>

    </b-row>
</template>
<script>

import axios from "axios"

export default {
  name: 'ConnexionRacine',
  methods: {
    postLogin: function () {
      axios.post(this.$hostname +'/login', {
        nom_utilisateur: this.form.nom_utilisateur,
        mot_de_passe: this.form.password
      })
          .then(function (value) {
            return value.data;
          }).then(data => {
        if (data.success) {
          // emission de l'event sur le socket vers le serveur
          this.$socket.emit('connexion', this.form.nom_utilisateur)
          this.$store.commit("login", data);
          this.$store.commit('updatedatalist')
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