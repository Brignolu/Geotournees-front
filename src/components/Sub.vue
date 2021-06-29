<!-- Composant Parent -->

<template>
  <div class="my-4">
    <b-row class="px-0" v-if=this.$store.state.utilisateur>
      <b-col cols="7">
        <SubList v-bind:SubData="this.$store.state.datalist"></SubList>
      </b-col>
      <b-col cols="5">
        <SubMaps v-bind:locations="this.$store.state.datalist" v-bind:zoom="this.$store.state.zoom"
                 v-bind:center="this.$store.state.mapcenter"></SubMaps>
      </b-col>
    </b-row>
  </div>
</template>

<script>
/* Import des Composants */
import SubMaps from "@/components/SubMaps";
import SubList from "@/components/SubList";
import {mapGetters} from "vuex";

export default {
  components: {SubList, SubMaps},
  props: {},
  methods: {
    /* Get From BDD */
    mounted() {
      this.$root.$on('mouse-click-abo', (item) => {
        console.log('on => mouse-click-abo ' + item.index)
      })
      this.$root.$on('mouse-click-marker', (item) => {
        console.log('on => mouse-click-marker')
        console.log(item.id)
      })
    },
  },
  computed:{
    ...mapGetters({listeup:'listUpdate'})

  },
  watch: {
    listeup: function () {
      console.log("update list watch")
      //this.$store.commit("updatedatalist")

    }
  }

}
</script>