<template>

  <div id="map-wrapper">
    <div id="map">
      <v-map :zoom="9" :center="[46.0736617, 6.4048087]" ref="lmap">
        <v-icondefault></v-icondefault>
        <v-tilelayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png"></v-tilelayer>
        <v-geojson :geojson="cantons"></v-geojson>
        <v-marker-cluster :options="clusterOptions" ref="markercluster">
          <template v-for="l in this.$store.state.interventionsfiltered">
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
            <v-marker v-else :key="l['id']"
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
      // console.log('store => setMarkerClicked');
      this.$store.commit("setMarkerClicked", item)
      this.$store.dispatch('loadCenter', [item['abonne.personne.adresses.coordonne.lat'],item['abonne.personne.adresses.coordonne.long']])
      this.$store.dispatch('loadZoom',15)
    }
  },
  computed:{
    center(){
      return this.$store.state.mapcenter
    },
    zoom(){
      return this.$store.state.zoom
    },
    interventions(){
      return this.$store.state.interventions
    }
  },
  watch: {
    center: function () {
     let MyMapObj =  this.$refs.lmap.mapObject
     MyMapObj.panTo(this.$store.state.mapcenter,{ animate:false })
      // console.log('Watch Center : ' + this.center);
    },
    zoom: function () {
      // console.log('Watch Zoom : ' + this.$store.getters.zoomUpdate)
      let MyMapObj =  this.$refs.lmap.mapObject
      MyMapObj.setZoom(this.$store.state.zoom)
    }
  },
  data() {
    return {
      clusterOptions: {
        zoomToBoundsOnClick: true,
        showCoverageOnHover: true,
        spiderfyOnMaxZoom: true,
        removeOutsideVisibleBounds: true,
        animate: false,
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
  created() {
    this.$store.dispatch('loadCenter', [46.0736617, 6.4048087])
    //let MyMapObj =  this.$refs.lmap.mapObject
    // MyMapObj.on('zoom',function (){
    //   console.log('zooming')
    //   console.log(MyMapObj.getZoom())
    // })
  }
}
</script>

