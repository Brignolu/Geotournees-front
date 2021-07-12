<template>
  <b-row class="min-vh-100" align-v="center">
    <b-col></b-col>
    <b-col cols="12" sm="10" md="8" lg="6" xl="4">
    <b-card>
      <b-form>
        <b-form-group label="Informations abonné:">
          <b-form-group label="n° Abonné">
          <b-form-input

              v-model="form.numero_abo"
              type="text"
              placeholder="Numéro abonné"
              :state="requiredStr('numero_abo')"
              required
          ></b-form-input>
          <b-form-invalid-feedback :state="requiredStr('numero_abo')">
            Veuillez préciser le numéro d'abonné
          </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group label="n° Transmetteur">
          <b-form-input

              v-model="form.transmetteur"
              type="number"
              :number="true"
              placeholder="Transmetteur"
              required
          ></b-form-input>
          </b-form-group>
          <b-form-group label="Identifiant WebBuncher">
          <b-form-input
              v-model="form.identifiant_wbb"
              type="number"
              :number="true"
              placeholder="Identifiant WBB"
              :state="requiredNbr('identifiant_wbb')"
              required
          ></b-form-input>
          <b-form-invalid-feedback :state="requiredNbr('identifiant_wbb')">
            Veuillez Préciser l'identifiant WebBuncher
          </b-form-invalid-feedback>
          </b-form-group>
        </b-form-group>

        <b-form-group label="Informations personnelles :">
          <b-form-input

              v-model="form.nom"
              type="text"
              placeholder="Nom"
              :state="requiredStr('nom')"
              required
          ></b-form-input>
          <b-form-invalid-feedback :state="requiredStr('nom')">
            Veuillez sélectionner un nom
          </b-form-invalid-feedback>

          <b-form-input

              v-model="form.prenom"
              type="text"
              placeholder="Prénom"
              :state="requiredStr('prenom')"
              required
          ></b-form-input>
          <b-form-invalid-feedback :state="requiredStr('prenom')">
            Veuillez sélectionner un prénom
          </b-form-invalid-feedback>

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
              :state="requiredStr('numero')"
              required
          ></b-form-input>
          <b-form-invalid-feedback :state="requiredStr('numero')">
            Veuillez sélectionner un numero
          </b-form-invalid-feedback>

          <b-form-input
              v-model="form.rue"
              type="text"
              placeholder="Rue"
              :state="requiredStr('rue')"
              required
          ></b-form-input>
          <b-form-invalid-feedback :state="requiredStr('rue')">
            Veuillez sélectionner la rue
          </b-form-invalid-feedback>

          <b-form-input
              v-model="form.codepostal"
              type="text"
              placeholder="CP"
              :state="requiredPostalCode('codepostal')"
              required
          ></b-form-input>
          <b-form-invalid-feedback :state="requiredPostalCode('codepostal')">
            Veuillez preciser le code postal
          </b-form-invalid-feedback>

          <b-form-input
              v-model="form.ville"
              type="text"
              :state="requiredStr('ville')"
              placeholder="Ville"
              required
          ></b-form-input>
          <b-form-invalid-feedback :state="requiredStr('ville')">
            Veuillez preciser la ville
          </b-form-invalid-feedback>
        </b-form-group>

        <div>
          <b-button v-on:click="postAbonne" variant="success">
            Créer l'Abonné
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

export default {
  name: 'NouvellePersonne',
  methods: {
    postAbonne: function () {

      axios.post(this.$hostname +'/create/abonne', {
            numero_abo: this.form.numero_abo,
            transmetteur: this.form.transmetteur,
            identifiant_wbb: this.form.identifiant_wbb,
          }
      )
          .then(function (response) {
            // console.log(response.status);
            // console.log(response.data.id);
            if (response.status === 201) {
              return response.data;
            }
          }).then((data) => {
        this.form.abonneId = data.id;
        // console.log("abonneOK")
        axios.post(this.$hostname +'/create/personne', {
              nom: this.form.nom.toUpperCase(),
              prenom: this.form.prenom.toUpperCase(),
              numtel: this.form.numtel,
              abonneId: this.form.abonneId
            }
        )
            .then(function (response) {
              // console.log(response.status);
              // console.log(response);
              if (response.status === 201) {
                return response.data;
              }
            }).then((data) => {
          this.form.personneId = data.id;
          // console.log("personneOK")
          axios.post(this.$hostname +'/create/adresse', {
                numero: this.form.numero,
                rue: this.form.rue,
                ville: this.form.ville,
                codepostal: this.form.codepostal,
                personneId: this.form.personneId
              }
          )
              .then(function (response) {
                // console.log(response.status);
                // console.log(response);
                if (response.status === 201) {
                  return response.data;
                }
              }).then((data) => {
            this.form.adresseId = data.id
            console.log("adresseOK")
            let url = "https://api-adresse.data.gouv.fr/search/?q=" + this.form.numero + " " + this.form.rue + "&postcode=" + this.form.codepostal + "&limit=1";

            axios.get(url).then(function (response) {
              // console.log(response.status);
              // console.log(response);
              if (response.status === 200) {
                return response.data;
              }
            }).then((data) => {
               console.log(data)
              // console.log(data.features[0].geometry.coordinates[1])
              //TODO : check if data.features exist => to do so is to check if object dat.containskey features
              if (data.features.length > 0 ) {
                this.form.lat = data.features[0].geometry.coordinates[1];
                this.form.long = data.features[0].geometry.coordinates[0];
                // console.log(this.form.lat)
                // console.log("APIOK")
                //this.$store.commit("setNotification", "Abonné Créé !")
                axios.post(this.$hostname +'/create/coordonnees', {
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
                  // console.log("coordoOK")
                  this.$store.commit("setNotification", "Abonné Créé !");
                  // Redirige vers la route précédente
                  this.$router.go(-1);

                }).catch(err => console.log(err))
              }else{
                alert("L'adresse entrée est incorrecte et/ou n'existe pas")
              }}).catch(err => console.log(err))
          }).catch(err => console.log(err))

        }).catch(err => console.log(err))

      }).catch(err => console.log(err))


    }
  },
  beforeMount() {
  },
  beforeRouteUpdate: (to, from, next) => {
      this.previousroute = from
    next()
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
      previousroute:null,
    }
  },
  computed: {
    requiredNbr() {
      return item => this.form[item] > 0;
    },
    requiredStr() {
      return item => this.form[item] !== "";
    },
    requiredPostalCode(){
      //let regex = /d/g;
      return item => this.form[item] !== ""; // && regex.exec(item);
    }

  },
}

</script>