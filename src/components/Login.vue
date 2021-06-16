<template>
  <row>

    <b-card id>
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
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-2" label="Mot de passe" label-for="input-2">
        <b-form-input
            id="input-2"
            v-model="form.password"
            placeholder="Mot de passe"
            type="password"
            required
        ></b-form-input>
      </b-form-group>
      <b-button v-on:click="postLogin" variant="primary">Envoyer</b-button>
      <pre>{{ utilisateur }}</pre>
    </b-form>
    </b-card>
  </row>
</template>
<script>
import axios from "axios"
export default {
  name: 'Login',
  props: ['utilisateur'],
  methods: { postLogin: function () {
      axios.post('http://localhost:3000/login', {
        nom_utilisateur: this.form.nom_utilisateur,
        mot_de_passe: this.form.password
      })
          .then(function (value) {
            return value.data;
          }).then(data => {
            this.utilisateur = data;
            if (data.ok) {
              this.$root.$emit('login-utilisateur', data);
              this.$router.push({name: 'visualisation', params: data});
            }
            else {
              this.utilisateur = data.etat;
            }
          }).catch(err => console.log(err));

    }},
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