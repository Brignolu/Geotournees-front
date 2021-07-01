<!-- Composant Parent -->

<template>
  <div class="my-4">

    <b-row class="px-0" v-if=this.$store.state.utilisateur>

      <b-col cols="7">

        <VisualisationListe v-bind:SubData="this.$store.state.datalist"></VisualisationListe>
      </b-col>
      <b-col cols="5">
        <VisualisationCarte v-bind:locations="this.$store.state.datalist" v-bind:zoom="this.$store.state.zoom"
                 v-bind:center="this.$store.state.mapcenter"></VisualisationCarte>
      </b-col>
    </b-row>
  </div>
</template>

<script>
/* Import des Composants */
import VisualisationCarte from "@/components/VisualisationCarte";
import VisualisationListe from "@/components/VisualisationListe";
import {mapGetters} from "vuex";

export default {
  components: {VisualisationListe, VisualisationCarte},
  props: {},
  methods: {
    /* Get From BDD */
    mounted() {
      this.$root.$on('mouse-click-abo', (item) => {
        console.log('on => mouse-click-abo ' + item.index)
      })
      this.$root.$on('mouse-click-marker', (item) => {
        console.log('on => mouse-click-marker')
        console.log(item)
      })
    },
  },
  computed: {
    ...mapGetters({listeup: 'listUpdate'}),
    //...mapGetters({})

  },
  watch: {
    listeup: function () {
      console.log("update list watch")
      //this.$store.commit("updatedatalist")

    }
  }

}
</script><!-- Composant Parent -->

<template>
  <div class="my-4">
    <b-row class="px-0" v-if=this.$store.state.utilisateur>
      <b-col sm>
        <VisualisationListe v-bind:SubData="this.$store.state.datalist"></VisualisationListe>
      </b-col>
      <b-col sm>
        <VisualisationCarte></VisualisationCarte>
      </b-col>
    </b-row>
  </div>
</template>

<script>
/* Import des Composants */
import VisualisationCarte from "@/components/VisualisationCarte";
import VisualisationListe from "@/components/VisualisationListe";
import {mapGetters} from "vuex";

export default {
  name: 'VisualisationCarteListe',
  components: {VisualisationListe, VisualisationCarte},
  methods: {
    /* Get From BDD */
    mounted() {
      this.$root.$on('mouse-click-abo', (item) => {
        console.log('on => mouse-click-abo ' + item.index)
      })
      this.$root.$on('mouse-click-marker', (item) => {
        console.log('on => mouse-click-marker')
        console.log(item)
      })
    },
  },
  computed: {
    ...mapGetters({listeup: 'listUpdate'})

  },
  watch: {
    listeup: function () {
      console.log("update list watch")
      //this.$store.commit("updatedatalist")

    }
  }

}
</script>