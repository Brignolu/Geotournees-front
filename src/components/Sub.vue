<!-- Composant Parent -->
<template>
  <b-container fluid>
    <b-row>
      <b-col cols="7">
        <SubList v-bind:SubData="SubDataList" v-bind:SelectRow="SelectDataRow"></SubList>
      </b-col>
      <b-col cols="5">
        <SubMaps v-bind:locations="SubDataList" v-bind:center="MapCenter" v-bind:popup="Popup"></SubMaps>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
/* Import des Composants */
import SubMaps from "@/components/SubMaps";
import SubList from "@/components/SubList";
import axios from "axios"

export default {
  components: {SubList, SubMaps},
  props: {
    SubDataList: Array,
    MapCenter: Array,
    Popup: Object,
    SelectDataRow: Object,

  },
  methods: {
    data() {
      return {
        SubDataList: [],
        MapCenter: [45.9, 6.129384],
      }
    },
    /* Mock la BDD */
    mockSubData() {
      this.SubDataList =
          [
            {
              'date': '2021-05-26T08:50:04.000Z',
              'abonne.numero_abo': '25552',
              'abonne.personne.nom': 'Garin',
              'abonne.personne.prenom': 'Enzo',
              'abonne.personne.adresses.numero': '66',
              'abonne.personne.adresses.rue': 'rue des Artistes',
              'abonne.personne.adresses.codepostal': '77380',
              'abonne.personne.adresses.ville': 'Valenciennes',
              'abonne.personne.numtel': '0450666666',
              'agent.nom': 'Frederic Munier',
              'motif.motif': 'Depannage',
              'type.type': 'Maintenance',
              'abonne.transmetteur': '6666',
              'abonne.identifiant_wbb': '676666666',
              'abonne.personne.adresses.coordonne.lat': 5.66,
              'abonne.personne.adresses.coordonne.long': 9.4,
            },
            {
              'date': '2021-05-26T08:50:04.000Z',
              'abonne.numero_abo': '25552',
              'abonne.personne.nom': 'Ferniez',
              'abonne.personne.prenom': 'Maximilien',
              'abonne.personne.adresses.numero': '94',
              'abonne.personne.adresses.rue': 'rue du Stade',
              'abonne.personne.adresses.codepostal': '77380',
              'abonne.personne.adresses.ville': 'Valenciennes',
              'abonne.personne.numtel': '0450666666',
              'agent.nom': 'Frederic Munier',
              'motif.motif': 'Depannage',
              'type.type': 'Maintenance',
              'abonne.transmetteur': '6666',
              'abonne.identifiant_wbb': '676666676',
              'abonne.personne.adresses.coordonne.lat': 6.66,
              'abonne.personne.adresses.coordonne.long': 9.4,
            },
            {
              'date': '2021-05-26T08:50:04.000Z',
              'abonne.numero_abo': '25552',
              'abonne.personne.nom': 'John',
              'abonne.personne.prenom': 'Laurent',
              'abonne.personne.adresses.numero': '80',
              'abonne.personne.adresses.rue': 'rue des Hodlers',
              'abonne.personne.adresses.codepostal': '77380',
              'abonne.personne.adresses.ville': 'Valenciennes',
              'abonne.personne.numtel': '0450666666',
              'agent.nom': 'Frederic Munier',
              'motif.motif': 'Depannage',
              'type.type': 'Maintenance',
              'abonne.transmetteur': '6666',
              'abonne.identifiant_wbb': '676676666',
              'abonne.personne.adresses.coordonne.lat': 4.66,
              'abonne.personne.adresses.coordonne.long': 9.4,
            }
          ]
    },
    /* Get From BDD */
    fetchData() {
      axios.get("http://127.0.0.1:3000/interventions")
          .then(function (value) {
            return value.data;
          }).then(data => {
        this.SubDataList = data;
      }).catch(err => console.log(err));
    }
  },
  mounted() {
    this.$root.$on('mouse-over-abo', (lat, lng) => {
      console.log('on => mouse-over-abo')
      this.MapCenter = [lat, lng];
    })
    this.$root.$on('mouse-click-abo', (item) => {
      console.log('on => mouse-click-abo')
      this.Popup = item.index;
    })
    this.$root.$on('mouse-click-marker', (item) => {
      console.log('on => mouse-click-marker')
      console.log(item.id)
      this.SelectDataRow = item.id;
    })
  },
  beforeMount() {
    //this.mockSubData();
    this.MapCenter = [46, 6.129384];
    this.fetchData();
  },


}
</script>