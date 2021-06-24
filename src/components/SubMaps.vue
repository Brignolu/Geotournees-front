<template>

  <div id="map-wrapper">

    <div id="map">
      <v-map :zoom="zoom" :center="center">
        <v-icondefault></v-icondefault>
        <v-tilelayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png"></v-tilelayer>
        <v-geojson :geojson="geojsoncommunes"></v-geojson>
        <v-marker-cluster :options="clusterOptions" @ready="ready()">
          <template v-for="l in locations">
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
import geojsoncommunes from "@/assets/communesHteSavoie.json"

export default {
  name: 'SubMaps',
  components: {
    'v-map': Vue2Leaflet.LMap,
    'v-tilelayer': Vue2Leaflet.LTileLayer,
    'v-icondefault': Vue2Leaflet.LIconDefault,
    'v-marker': Vue2Leaflet.LMarker,
    'v-marker-cluster': Vue2LeafletMarkercluster,
    'v-geojson': Vue2Leaflet.LGeoJson
  },
  props: ['locations', 'center', 'zoom'],
  methods: {
    click: function (item) {
      this.$root.$emit('mouse-click-marker', item);
      console.log('emit => mouse-click-marker');
    },
    ready: (e) => console.log('ready', e),
  },
  watch: {
    center: function (val) {
      console.log('Watch Center');
      this.center = val;
    },
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
      geojsoncommunes: geojsoncommunes
    }
  },
  beforeMount() {
    /*
     var file = fs.open("@/assets/communesHteSavoie.json");
     this.geojson = file;
     */
  },
  mounted() {
  },
  created() {
  }
}
</script>

<!--TODO : Relier vue + GEOJSON-->

