<template>
  <div class="my-4">
    <b-row class="px-0">
      <b-col>
        <VisualisationCarte></VisualisationCarte>
      </b-col>
      <b-col>
        <VisualisationListe></VisualisationListe>
      </b-col>
    </b-row>
  </div>
</template>

<script>
/* Import des Composants */
import VisualisationCarte from "@/components/VisualisationCarte";
import VisualisationListe from "@/components/VisualisationListe";

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
}
</script>