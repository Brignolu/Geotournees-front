<template>
  <div class="d-flex flex-column min-vh-100 justify-content-center align-items-center">
    <b-row>
      <b-col>
        <b-card>
          <b-form>
            <b-form-group label="Numéro d'abonné :">
              <b-form-input

                  v-model="form.numero_abo"
                  type="text"
                  placeholder="Numéro abonné"
                  required
              ></b-form-input>
            </b-form-group>
            <b-form-group label="Transmetteur :">
              <b-form-input

                  v-model="form.transmetteur"
                  type="text"
                  placeholder="Transmetteur"
                  required
              ></b-form-input>
            </b-form-group>
            <b-form-group label="Identifiant WBB :">
              <b-form-input

                  v-model="form.identifiant_wbb"
                  type="text"
                  placeholder="Identifiant WBB"
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
    }
  },
  beforeMount() {
  },


  data() {
    return {
      form: {
        numero_abo: 0,
        transmetteur: 0,
        identifiant_wbb: 0,
        personneId: 0,

      },
    }
  }
}
</script>