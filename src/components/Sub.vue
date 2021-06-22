<!-- Composant Parent -->

<template>
  <div class="my-4">
    <b-row class="px-0" v-if=this.$store.state.utilisateur>
      <b-col cols="7">
        <SubList v-bind:SubData="this.$store.state.datalist" v-bind:SelectRow="SelectDataRow"></SubList>
      </b-col>
      <b-col cols="5">
        <SubMaps v-bind:locations="this.$store.state.datalist" v-bind:zoom="this.$store.state.zoom" v-bind:center="this.$store.state.mapcenter"
                 v-bind:popup="Popup"></SubMaps>
      </b-col>
    </b-row>
  </div>
</template>

<script>

/* Import des Composants */
import SubMaps from "@/components/SubMaps";
import SubList from "@/components/SubList";
import axios from "axios";


export default {
  components: {SubList, SubMaps},
  props: {
    Popup: Object,
    SelectDataRow: Object,
  },
  methods: {
    /* Get From BDD */
    fetchData() {
      axios.get("http://127.0.0.1:3000/interventions")
          .then(function (value) {
            return value.data;
          }).then(data => {

        //this.SubDataList = data;
        this.$store.commit("updatedatalist", data);
      }).catch(err => console.log(err));
    }
  },
  mounted() {
    this.$root.$on('mouse-click-abo', (item) => {
      console.log('on => mouse-click-abo')
      this.Popup = item.index;
    })
    this.$root.$on('mouse-click-marker', (item) => {
      console.log('on => mouse-click-marker')
      console.log(item.id)
      this.SelectDataRow = item.id;
    })
    if (this.$store.state.message) {
      this.$bvToast.toast(this.$store.state.message, {
        title: 'Notification',
        autoHideDelay: 5000,
        appendToast: false
      });
      this.$store.commit("messagedestroy");
    }
  },
  beforeMount() {
    this.fetchData();
  },


}

</script>
<!--TODO: Toast-->