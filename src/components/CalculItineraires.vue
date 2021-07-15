<template>

  <div id="map-wrapper">
    <b-form inline>
      <b-form-datepicker v-model="customFilter.date"
                         :placeholder="'Filtrer par date'"
                         today-button
                         label-today-button="Aujourd'hui"
                         reset-button
                         label-reset-button="Supprimer le filtre"
                         close-button
                         label-close-button="X"
                         label-no-date-selected="Aucune date filtrée"
                         :date-disabled-fn="dateDisabled"
      >
      </b-form-datepicker>

      <b-form-select v-model="customFilter.agent" :options="optionsagents">
      </b-form-select>
    </b-form>
    <div id="map">
      <v-map :zoom="9" :center="[46.0736617, 6.4048087]">
        <v-icondefault></v-icondefault>
        <v-tilelayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png"></v-tilelayer>
        <v-routing-machine :waypoints="waypoints" :draggable-waypoints="false" ref="routing" ></v-routing-machine>
      </v-map>
    </div>
  </div>

</template>

<script>

/* import des bibliothèques et des assets */
import * as Vue2Leaflet from 'vue2-leaflet';


import "leaflet/dist/leaflet.css";
import LRoutingMachine from '@/components/LRoutingMachine'

export default {
  name: 'CalculItineraires',
  components: {
    'v-routing-machine': LRoutingMachine,
    'v-map': Vue2Leaflet.LMap,
    'v-tilelayer': Vue2Leaflet.LTileLayer,
    'v-icondefault': Vue2Leaflet.LIconDefault,
  },
  methods:{
    dateDisabled(ymd, date) {
      const weekday = date.getDay()
      return weekday === 0 || weekday === 6
    },
  },
  computed:{
    interventions(){
      return this.$store.state.interventions
    },
    interventionsFiltered() {
      let customFilter = this.customFilter
      if (this.interventions === null) {
        return null
      } else {
        var filtered = this.interventions.filter(function (el) {
          var filter = el;
          if (customFilter.agent !== null) {
            filter = el['agent.nom'].toLowerCase().indexOf(customFilter.agent.toLowerCase()) > -1
          }
          if (customFilter.date !== null) {
            filter = el['date'].split('T')[0].toLowerCase().indexOf(customFilter.date.toLowerCase()) > -1
          }
          if (customFilter.date !== null && customFilter.agent !== null) {
            filter = el['date'].split('T')[0].toLowerCase().indexOf(customFilter.date.toLowerCase()) > -1
                && el['agent.nom'].toLowerCase().indexOf(customFilter.agent.toLowerCase()) > -1
          }
          if (customFilter.date !== null && customFilter.agent !== null) {
            filter = el['date'].split('T')[0].toLowerCase().indexOf(customFilter.date.toLowerCase()) > -1
                && el['agent.nom'].toLowerCase().indexOf(customFilter.agent.toLowerCase()) > -1
          }
          return filter
        });
        let sorted = filtered.sort((a,b)=> b.date - a.date)
        return sorted
      }
    }
  },
  watch: {
    interventionsFiltered(){
      this.waypoints = []
      for(let i =0; i < this.interventionsFiltered.length; i++){
        this.waypoints.push({lat:this.interventionsFiltered[i]['abonne.personne.adresses.coordonne.lat'],lng:this.interventionsFiltered[i]['abonne.personne.adresses.coordonne.long']})
      }

      this.$refs.routing.layer.setWaypoints(this.waypoints)
    }
  },
  data() {
    return {
      waypoints: [
      ],
      customFilter: {
        agent: null,
        date: null,
      },
      optionsagents: [],
      }
    },
  created() {
    for (let i in this.$store.state.agents) {
      this.optionsagents.push({value: this.$store.state.agents[i].nom, text: this.$store.state.agents[i].nom})
    }
  }
}
</script>

