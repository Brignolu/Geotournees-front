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
                  type="number"
                  placeholder="Transmetteur"
                  required
              ></b-form-input>


              <b-form-input
                  v-model="form.identifiant_wbb"
                  type="number"
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

      axios.post('http://localhost:3000/create/abonne', {
            numero_abo: this.form.numero_abo,
            transmetteur: this.form.transmetteur,
            identifiant_wbb: this.form.identifiant_wbb,
          }
      )
          .then(function (response) {
            console.log(response.status);
            console.log(response.data.id);
            if (response.status === 201) {
              return response.data;
            }
          }).then((data) => {
        this.form.abonneId = data.id;
        console.log("abonneOK")
        axios.post('http://localhost:3000/create/personne', {
              nom: this.form.nom,
              prenom: this.form.prenom,
              numtel: this.form.numtel,
              abonneId: this.form.abonneId
            }
        )
            .then(function (response) {
              console.log(response.status);
              console.log(response);
              if (response.status === 201) {
                return response.data;
              }
            }).then((data) => {
          this.form.personneId = data.id;
          console.log("personneOK")
          axios.post('http://localhost:3000/create/adresse', {
                numero: this.form.numero,
                rue: this.form.rue,
                ville: this.form.ville,
                codepostal: this.form.codepostal,
                personneId: this.form.personneId
              }
          )
              .then(function (response) {
                console.log(response.status);
                console.log(response);
                if (response.status === 201) {
                  return response.data;
                }
              }).then((data) => {
            this.form.adresseId = data.id
            console.log("adresseOK")
            var url = "https://api-adresse.data.gouv.fr/search/?q=" + this.form.numero + " " + this.form.rue + "&postcode=" + this.form.codepostal + "&limit=1";

            axios.get(url).then(function (response) {
              console.log(response.status);
              console.log(response);
              if (response.status === 200) {
                return response.data;
              }
            }).then((data) => {
              console.log(data.features[0])
              console.log(data.features[0].geometry.coordinates[1])
              this.form.lat = data.features[0].geometry.coordinates[1];
              this.form.long = data.features[0].geometry.coordinates[0];
              console.log(this.form.lat)
              console.log("APIOK")
              //this.$store.commit("messagecreate", "Abonné Créé !")
              axios.post('http://localhost:3000/create/coordonnees', {
                    latitude: this.form.lat,
                    longitude: this.form.long,
                    adresseId: this.form.adresseId
                  }
              )
                  .then(function (response) {
                    console.log(response.status);
                    console.log(response);
                    if (response.status === 201) {
                      return response.data;
                    }
                  }).then(() => {
                console.log("coordoOK")
                this.$store.commit("messagecreate", "Abonné Créé !");
                this.$router.push('/intervention');

              }).catch(err => console.log(err))
            }).catch(err => console.log(err))
          }).catch(err => console.log(err))

        }).catch(err => console.log(err))

      }).catch(err => console.log(err))


    }
  },
  beforeMount() {
  },


  data() {
    return {
      form: {
        numero_abo: "",
        transmetteur: 0,
        identifiant_wbb: 0,
        nom: "",
        prenom: "",
        numtel: "",
        numero: "",
        rue: "",
        codepostal: "",
        ville: "",
        lat: 0.0,
        long: 0.0,
        abonneId: 0,
        adresseId: 0,
        personneId: 0,
      },
    }
  }
}
</script>