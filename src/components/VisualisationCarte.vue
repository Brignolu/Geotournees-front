<template>

  <div id="map-wrapper">
    center : {{this.centerLatLong}} zoom :{{this.zoomlvl}} data center : {{ center }} data zoom : {{ this.zoom }}
    <div id="map">
      <v-map :zoom="this.$store.getters.zoomUpdate" :center="this.$store.getters.centerUpdate" ref="map">
        <v-icondefault></v-icondefault>
        <v-tilelayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png"></v-tilelayer>
        <v-geojson :geojson="cantons"></v-geojson>
        <v-marker-cluster :options="clusterOptions" @ready="ready()">
          <template v-for="l in this.$store.state.datalist">
            <v-marker v-if="l['type.type'] === 'Dépannage'" :key="l['id']"
                      :lat-lng="[l['abonne.personne.adresses.coordonne.lat'],l['abonne.personne.adresses.coordonne.long']]"
                      :icon="depannageIcon" @click="click(l)">
            </v-marker>
            <v-marker v-else-if="l['type.type'] === 'Maintenance'" :key="l['id']"
                      :lat-lng="[l['abonne.personne.adresses.coordonne.lat'],l['abonne.personne.adresses.coordonne.long']]"
                      :icon="maintenanceIcon" @click="click(l)">
            </v-marker>
            <v-marker v-else-if="l['type.type'] === 'Installation'" :key="l['id']"
                      :lat-lng="[l['abonne.personne.adresses.coordonne.lat'],l['abonne.personne.adresses.coordonne.long']]"
                      :icon="installationIcon" @click="click(l)">
            </v-marker>
          </template>
        </v-marker-cluster>
      </v-map>
    </div>
  </div>

</template>

<script>

/* import des bibliothèques et des assets */
import * as Vue2Leaflet from 'vue2-leaflet';
import Vue2LeafletMarkercluster from 'vue2-leaflet-markercluster';

import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import L from "leaflet";
import icon_maintenance from "@/assets/Marqueur00.png";
import icon_depannage from "@/assets/Marqueur06.png";
import icon_installation from "@/assets/Marqueur08.png";
import cantons from "@/assets/communesHteSavoie.json"

export default {
  name: 'VisualisationCarte',
  components: {
    'v-map': Vue2Leaflet.LMap,
    'v-tilelayer': Vue2Leaflet.LTileLayer,
    'v-icondefault': Vue2Leaflet.LIconDefault,
    'v-marker': Vue2Leaflet.LMarker,
    'v-marker-cluster': Vue2LeafletMarkercluster,
    'v-geojson': Vue2Leaflet.LGeoJson
  },
  methods: {
    click: function (item) {
      console.log('store => mouseclickmarker');
      this.$store.commit("mouseclickmarker", item)
      this.$store.commit('updatemapcenter', [item['abonne.personne.adresses.coordonne.lat'],item['abonne.personne.adresses.coordonne.long']])
      this.$store.commit('individualzoom')
    },
    ready: (e) => console.log('ready', e),
  },
  computed:{
    center(){
      return this.$store.getters.centerUpdate
    },
    zoom(){
      return this.$store.getters.zoomUpdate
    }
  },
  watch: {
    center: function () {
      console.log('Watch Center');
      console.log(this.$store.getters.centerUpdate)
    },
    zoom: function () {
      console.log('Watch Zoom');
      console.log(this.$store.getters.zoomUpdate)
    }
  },
  data() {
    return {

      clusterOptions: {
        zoomToBoundsOnClick: true,
        showCoverageOnHover: true,
        spiderfyOnMaxZoom: true,
        removeOutsideVisibleBounds: true,
      },

      /* Icons */
      maintenanceIcon: L.icon({
        iconUrl: icon_maintenance,
        iconSize: [42, 42],
        iconAnchor: [13, 42],
      }),

      depannageIcon: L.icon({
        iconUrl: icon_depannage,
        iconSize: [42, 42],
        iconAnchor: [13, 42],
      }),

      installationIcon: L.icon({
        iconUrl: icon_installation,
        iconSize: [42, 42],
        iconAnchor: [13, 42],
      }),
      cantons: cantons,
      centerLatLong:null,
      zoomlvl: null,
    }
  },
  beforeMount() {
  },
  mounted() {
    this.$refs.map.mapObject.on('move', () => {
          this.centerLatLong = this.$refs.map.mapObject.getCenter()
    }),
        this.$refs.map.mapObject.on('zoom', () => {
          this.zoomlvl = this.$refs.map.mapObject.getZoom()
          this.$store.commit("setzoom", this.$refs.map.mapObject.getZoom())
        })
  },
  created() {
  }
}
</script>

