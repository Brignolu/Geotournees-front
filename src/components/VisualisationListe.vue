<template>
  <div>

    <b-row>
      <b-col cols="10">

        <b-input-group
        >
          <b-form-input
              id="filter-input"
              v-model="filter"
              type="search"
              placeholder="Recherche"
          >
          </b-form-input>
          <b-input-group-append>
            <b-button
                @click="resetFilter"
                variant="secondary"
            >
              Effacer
            </b-button>
          </b-input-group-append>
        </b-input-group>
      </b-col>
    </b-row>


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

      <b-form-select v-model="customFilter.type" :options="optionstypes">
      </b-form-select>

      <b-form-select v-model="customFilter.agent" :options="optionsagents">
      </b-form-select>

      <b-button
          variant="outline-secondary"
          size="sm"
          @click="postSoplanning">
        Synchronisation SoPlanning
      </b-button>
    </b-form>


    <b-table responsive sticky-header="70vh"
             hover
             :items="this.interventionsFiltered"
             :fields="fields"
             :filter="filter"
             @row-clicked="click"
             @row-hovered="mouseOver"
             ref="myTable"
             selectable
             select-mode="single"
             id="myTable"
             primary-key="id"
    >

      <template #cell(dateformat)="data">
        {{ data.item.date.split('T')[0] }}
      </template>

      <template #cell(nompnom)="data">
        {{ data.item["abonne.personne.nom"] }} {{ data.item["abonne.personne.prenom"] }}
      </template>

      <template #cell(fulladdr)="data">
        {{ data.item["abonne.personne.adresses.numero"] }} {{ data.item["abonne.personne.adresses.rue"] }}
        {{ data.item["abonne.personne.adresses.codepostal"] }} {{ data.item["abonne.personne.adresses.ville"] }}
      </template>

      <template #cell(show_details)="data">
        <b-button-group>
          <b-button
              :href="'http://10.200.2.102/webbuncher/gestionAbonne/rechercher.php?idA=' + data.item['abonne.identifiant_wbb']">
            {{ data.item['abonne.numero_abo'] }}
          </b-button>
          <b-button size="sm" @click="data.toggleDetails" variant="primary">
            <b-icon-clipboard-plus></b-icon-clipboard-plus>
          </b-button>
          <b-button @click="showDeleteModal(data.item)" variant="danger" v-if="$store.state.utilisateur.roleId > 1">
            <b-icon-trash></b-icon-trash>
          </b-button>
        </b-button-group>

      </template>

      <template #row-details="data">
        <div>
          <b-row>
            <b-col>
              <b>Intervention:</b>
            </b-col>
            <b-col>
              {{ data.item["type.type"] }} {{ data.item["motif.motif"] }}
            </b-col>
            <b-col>
              <b>Heure:</b>
            </b-col>
            <b-col>
              {{ data.item.date.split('T')[1].substr(0, 5) }}
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <b>
                n° Téléphone:
              </b>
            </b-col>
            <b-col>
              {{ data.item["abonne.personne.numtel"] }}
            </b-col>
          </b-row>
          <b-row>
            <b-col><b>Commentaires : </b></b-col>
            <b-col>{{ data.item["commentaires"] }}</b-col>
          </b-row>
        </div>
      </template>
    </b-table>

    <b-modal id="my-modal" centered hide-footer title="Confirmation">
      <div class="d-block text-center">
        <h4>Confirmez-vous la suppression ?</h4>
      </div>
      <b-row>
        <b-col>
          <b-button variant="success" block @click="deleteIntervention(itemDelete)">
            <b-icon-check></b-icon-check>
          </b-button>
        </b-col>
        <b-col>
          <b-button variant="danger" block @click="hideDeleteModal">
            <b-icon-x></b-icon-x>
          </b-button>
        </b-col>
      </b-row>
    </b-modal>

  </div>
</template>

<script>
import axios from "axios";
import {mapGetters} from "vuex";
import moment from "moment";

export default {
  name: 'VisualisationListe',
  emits: ['tablehover', 'tableclick'],

  data() {
    return {
      /* date; heure; numabo; nom; pnom; nvoie; addr; postc; comm; telabo; agent; motif; intertype; numtrans; idabo; */
      fields: [
        {
          label: 'Date',
          key: 'dateformat',
          sortable: true
        },
        {
          label: 'Nom Prénom',
          key: 'nompnom',
          sortable: false
        },
        {
          label: 'Adresse',
          key: 'fulladdr',
          sortable: false
        },
        {label: 'Agent', key: 'agent.nom', sortable: true}, {
          label: 'Transmetteur n°',
          key: 'abonne.transmetteur',
          sortable: false
        },
        {
          label: 'Numéro Abonné',
          key: 'show_details',
          sortable: false
        }],
      filter: '',
      customFilter: {
        agent: null,
        type: null,
        date: null,
      },
      optionsagents: [{value: null, text: "Filtrer par agent"}],
      optionstypes: [{value: null, text: "Filtrer par type d'intervention"}],
      itemDelete: null
    }
  },
  methods: {

    // desactive les weekends dans le date picker getday() === 0 => dimanche getday() === 6 => samedi
    dateDisabled(ymd, date) {
      const weekday = date.getDay()
      return weekday === 0 || weekday === 6
    },

    // Synchronisation avec l'api SoPlanning
    postSoplanning: async function () {
      await axios.get(this.$hostname + '/synchronisationplanning').catch(err => console.log(err))
    },

    // reset le filtre et recentre dezoom la carte
    resetFilter() {
      this.filter = ''
      this.$store.commit('setMarkerClicked', null)
      this.$store.dispatch("loadCenter", [46.0736617, 6.4048087])
      this.$store.dispatch("loadZoom", 9)
    },

    click(item) {

      this.$root.$emit('mouse-click-abo', item)
      /*
      console.log('emit => mouse-click-abo')
      console.log(item)
      console.log(item.id)
      */
    },

    // change le centre et le zoom
    mouseOver(item) {
      let coords = [item['abonne.personne.adresses.coordonne.lat'], item['abonne.personne.adresses.coordonne.long']]
      this.$store.dispatch("loadCenter", coords)
      this.$store.dispatch("loadZoom", 15)
    },

    // Ouvre le modal de confirmation de supression
    showDeleteModal(item) {
      this.itemDelete = item
      this.$bvModal.show('my-modal')
    },
    hideDeleteModal() {
      this.$bvModal.hide('my-modal')
    },

    // Supprime l'intervention : emet un evenement sur le websocket afin que tous les clients raffraichissent l'etat du store contenant les interventions
    deleteIntervention(item) {
      console.log(item.id);
      this.$bvModal.hide('my-modal')
      axios.delete(this.$hostname + "/delete/intervention/" + item.id, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': '*'
        }
      }).then(function (response) {
        if (response.status === 204)
          return response
      }).then(() => {
        this.$store.commit("setNotification", "Intervention Supprimée")
        this.$socket.emit('ws-refresh-intervention')
        this.$store.dispatch("loadInterventions")
      })

    },
  },
  watch: {

    // Watch l'etat clickmarkerupdate
    markerup: function () {
      /*
      // On récupère l'element puis on simule un click
       let myTable = this.$refs.myTable.$el,
           tableBody = myTable.getElementsByTagName('tbody')[0],
           tableRows = tableBody.getElementsByTagName('tr');
           tableRows[this.$store.state.itemselected.id - 1].click()
       */
      this.filter = this.$store.getters.clickMarkerUpdate['abonne.personne.nom'];
      this.$store.dispatch("loadCenter", [this.$store.getters.clickMarkerUpdate['abonne.personne.adresses.coordonne.lat'], this.$store.state.itemselected['abonne.personne.adresses.coordonne.long']])
    }
  },
  computed: {
    ...mapGetters({markerup: "clickMarkerUpdate"}),

    interventions: {
      get: function () {
        return this.$store.state.interventions
      },
    },
    // retourne les interventions filtré avec les champs date,type d'installation et agent
    interventionsFiltered() {
      let customFilter = this.customFilter
      // console.log(customFilter.date)
      if (customFilter.date === "" || customFilter.date === null) {
        // console.log("selectedDateToday")
        this.$store.commit("setSelectedDate", moment().format('YYYY-MM-DD'))
      } else {
        // console.log("selectedDate")
        this.$store.commit("setSelectedDate", customFilter.date)
      }
      if (this.interventions === null) {
        return this.$store.state.interventions
      } else {
        var filtered = this.interventions.filter(function (el) {
          var filter = el;
          if (customFilter.agent !== null) {
            filter = el['agent.nom'].toLowerCase().indexOf(customFilter.agent.toLowerCase()) > -1
          }
          if (customFilter.type !== null) {
            filter = el['type.type'].toLowerCase().indexOf(customFilter.type.toLowerCase()) > -1
          }
          if (customFilter.date !== null) {
            filter = el['date'].split('T')[0].toLowerCase().indexOf(customFilter.date.toLowerCase()) > -1
          }
          if (customFilter.date !== null && customFilter.type !== null) {
            filter = el['date'].split('T')[0].toLowerCase().indexOf(customFilter.date.toLowerCase()) > -1 &&
                el['type.type'].toLowerCase().indexOf(customFilter.type.toLowerCase()) > -1
          }
          if (customFilter.type !== null && customFilter.agent !== null) {
            filter = el['type.type'].toLowerCase().indexOf(customFilter.type.toLowerCase()) > -1 &&
                el['agent.nom'].toLowerCase().indexOf(customFilter.agent.toLowerCase()) > -1
          }
          if (customFilter.date !== null && customFilter.agent !== null) {
            filter = el['date'].split('T')[0].toLowerCase().indexOf(customFilter.date.toLowerCase()) > -1
                && el['agent.nom'].toLowerCase().indexOf(customFilter.agent.toLowerCase()) > -1
          }
          if (customFilter.date !== null && customFilter.agent !== null && customFilter.type !== null) {
            filter = el['date'].split('T')[0].toLowerCase().indexOf(customFilter.date.toLowerCase()) > -1
                && el['agent.nom'].toLowerCase().indexOf(customFilter.agent.toLowerCase()) > -1 &&
                el['type.type'].toLowerCase().indexOf(customFilter.type.toLowerCase()) > -1
          }
          return filter
        });
        this.$store.commit("setInterventionsFiltered", filtered)
        return filtered
      }
    }

  },

  created: function () {
    // On charge les values dans le select
    for (let i in this.$store.state.agents) {
      this.optionsagents.push({value: this.$store.state.agents[i].nom, text: this.$store.state.agents[i].nom})
    }
    for (let j in this.$store.state.type) {
      this.optionstypes.push({value: this.$store.state.type[j].type, text: this.$store.state.type[j].type})
    }
  },

};
</script>

