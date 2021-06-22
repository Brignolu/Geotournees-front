<template>
  <div class="d-flex flex-column min-vh-100 justify-content-center align-items-center">
    <b-row>
      <b-col>
        <b-card>
          <b-form>
            <b-form-group label="Informations abonné :">
              <b-form-input

                  v-model="form.numero_abo"
                  type="text"
                  placeholder="Numéro abonné"
                  required
              ></b-form-input>


              <b-form-input

                  v-model="form.transmetteur"
                  type="text"
                  placeholder="Transmetteur"
                  required
              ></b-form-input>


              <b-form-input
                  v-model="form.identifiant_wbb"
                  type="text"
                  placeholder="Identifiant WBB"
                  required
              ></b-form-input>
            </b-form-group>

            <b-form-group label="Informations personnelles :">
              <b-form-input

                  v-model="form.nom"
                  type="text"
                  placeholder="Nom"
                  required
              ></b-form-input>

              <b-form-input

                  v-model="form.prenom"
                  type="text"
                  placeholder="Prénom"
                  required
              ></b-form-input>

              <b-form-input

                  v-model="form.numtel"
                  type="text"
                  placeholder="N° téléphone"
                  required
              ></b-form-input>
            </b-form-group>

            <b-form-group label="Adresse :">
              <b-form-input
                  v-model="form.numero"
                  type="text"
                  placeholder="Numéro de voie"
                  required
              ></b-form-input>

              <b-form-input
                  v-model="form.rue"
                  type="text"
                  placeholder="Rue"
                  required
              ></b-form-input>

              <b-form-input
                  v-model="form.codepostal"
                  type="text"
                  placeholder="CP"
                  required
              ></b-form-input>

              <b-form-input
                  v-model="form.ville"
                  type="text"
                  placeholder="Ville"
                  required
              ></b-form-input>
            </b-form-group>

            <div>
              <b-button v-on:click="postAbonne" variant="success">
                Créer l'Abonné
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
  name: 'Personne',
  methods: {
    postAbonne: function () {
      axios.post('http://localhost:3000/create/intervention', {
            numero_abo: this.form.numero_abo,
            transmetteur: this.form.transmetteur,
            identifiant_wbb: this.form.identifiant_wbb,
            personneId: this.form.personneId,
          }
      )
          .then(function (response) {
            console.log(response.status);
            console.log(response);
            if (response.status === 201) {
              return response.data
            }
          }).then(() => {

        this.$store.commit("messagecreate", "Abonné Créé !")
        this.$router.push({name: 'intervention'});

      }).catch(err => console.log(err))

/*
      axios.post('http://localhost:3000/create/intervention', {
            numero_abo: this.form.numero_abo,
            transmetteur: this.form.transmetteur,
            identifiant_wbb: this.form.identifiant_wbb,
            personneId: this.form.personneId,
          }
      )
          .then(function (response) {
            console.log(response.status);
            console.log(response);
            if (response.status === 201) {
              return response.data
            }
          }).then(() => {

        this.$store.commit("messagecreate", "Abonné Créé !")
        this.$router.push({name: 'intervention'});

      }).catch(err => console.log(err))

      axios.post('http://localhost:3000/create/intervention', {
            numero_abo: this.form.numero_abo,
            transmetteur: this.form.transmetteur,
            identifiant_wbb: this.form.identifiant_wbb,
            personneId: this.form.personneId,
          }
      )
          .then(function (response) {
            console.log(response.status);
            console.log(response);
            if (response.status === 201) {
              return response.data
            }
          }).then(() => {

        this.$store.commit("messagecreate", "Abonné Créé !")
        this.$router.push({name: 'intervention'});

      }).catch(err => console.log(err))
      */
    }
  },
  beforeMount() {
  },


  data() {
    return {
      form: {
        numero_abo: "",
        transmetteur: "",
        identifiant_wbb: "",
        personneId: 0,
        nom: "",
        prenom:"" ,
        numtel:"",
        abonneId: "",
        adresseId:""
      },
    }
  }
}
</script>