<template>
  <div class="my-1 mx-1">
    <b-row class="px-0">
      <b-col md="3" sm="12" lg="6" xl="6">
        <VisualisationCarte></VisualisationCarte>
      </b-col>
      <b-col md="9" sm="12" lg="6" xl="6">
        <VisualisationListe></VisualisationListe>
      </b-col>
    </b-row>
      <b-row>
        <b-col md="2" sm="2" lg="2" xl="2">
          <h2>Interventions à prévoir :</h2>
          <div class="external-event"
               v-for="(item, i) in this.$store.state.unplanevents"
               :key="i"
               draggable="true"
               @dragstart="onEventDragStart($event, item)">
            <div class="unplanned-event">
            <strong>{{ item.title }}</strong>
            <div>{{ item.content }}</div>
            </div>
          </div>
        </b-col>
      <b-col md="10" sm="10" lg="10" xl="10">
        <vue-cal hide-weekends
                 :time-from="8 * 60"
                 :time-to="19 * 60"
                 active-view="day"
                 :time="true"
                 :snap-to-time="15"
                 :disable-views="['years', 'year', 'month','week']"
                 :events="this.$store.state.events"
                 :editable-events="{ title: false, drag: true, resize: false, delete: true, create: false }"
                 :split-days="this.$store.state.agentsCalendar"
                 :special-hours="specialHours"
                 hide-view-selector
                 :on-event-dblclick="showCalendarModal"
                 :selected-date = "this.CalendarDateSelected"
                 @event-drop="onEventDrop"
                 locale="fr"
                 class="vuecal--full-height-delete"
        />
<!--        todo ajouter locale="fr" avec import i18n/fr.js-->
      </b-col>
      </b-row>
    <b-modal id="calendar-modal" centered hide-footer title="Interventions">
      <div class="d-block text-center">
        <h4>{{ modalEvent.title }}</h4>
        <p>{{ modalEvent.content }}
        </p>
      </div>
      <b-row>
        <b-col>
          <b-button variant="danger" block @click="this.hideCalendarModal()">
            <b-icon-x></b-icon-x>
          </b-button>
        </b-col>
      </b-row>
    </b-modal>
  </div>
</template>

<script>

/* Import des Composants */
import VisualisationCarte from "@/components/VisualisationCarte";
import VisualisationListe from "@/components/VisualisationListe";
import VueCal from 'vue-cal'
import 'vue-cal/dist/i18n/fr.js'
import 'vue-cal/dist/vuecal.css'
import 'vue-cal/dist/drag-and-drop.js'
import {mapGetters} from 'vuex'

export default {
  name: 'VisualisationCarteListe',
  components: {VisualisationListe, VisualisationCarte, VueCal},
  data() {
    return {
      events: [{
        start: '2021-09-22 12:00',
        end: '2021-09-22 13:45',
        title: 'Intervention Mme MUNIER',
        content: 'Attention chien méchant',
        class: 'blue-event',
        deletable: true,
        resizable: true,
        draggable: true,
        split: 1
      },
        {
          start: new Date(),
          end: new Date().addHours(2),
          title: 'Intervention Mme MUGNIER',
          content: 'Attention Chien Méchant',
          class: 'red-event',
          deletable: false,
          resizable: false,
          draggable: false,
          split: 2
        }],
      specialHours: {
        1: {from: 12 * 60, to: 13 * 60 + 30, class: 'lunch'},
        2: {from: 12 * 60, to: 13 * 60 + 30, class: 'lunch'},
        3: {from: 12 * 60, to: 13 * 60 + 30, class: 'lunch'},
        4: {from: 12 * 60, to: 13 * 60 + 30, class: 'lunch'},
        5: {from: 12 * 60, to: 13 * 60 + 30, class: 'lunch'}
      },
      modalEvent: {
        start: null,
        end: null,
        title: null,
        content: null,
        class: null,
        deletable: null,
        resizable: null,
        draggable: null,
        split: null
    }
    }
  },
  computed: {
    ...mapGetters({CalendarDateSelected: 'selectedDateGetter'})
  },
  watch: {
    // on relie le filtre avec la selection du jour sur le composant calendrier

    /*
      CalendarDateSelected() {
      let fcapi = this.$refs.fullCalendar.getApi()
      fcapi.gotoDate(this.CalendarDateSelected)
      }
      */
  },
  methods: {

    onEventDragStart(e, draggable) {
      // Passing the event's data to Vue Cal through the DataTransfer object.
      e.dataTransfer.setData('event', JSON.stringify(draggable))
      e.dataTransfer.setData('cursor-grab-at', e.offsetY)
    },
    // The 3 parameters are destructured from the passed $event in @event-drop="onEventDrop".
    // `event` is the final event as Vue Cal understands it.
    // `originalEvent` is the event that was dragged into Vue Cal, it can come from the same
    //  Vue Cal instance, another one, or an external source.
    // `external` is a boolean that lets you know if the event is not coming from any Vue Cal.
    onEventDrop({event, originalEvent, external}) {
      // If the event is external, delete it from the data source on drop into Vue Cal.
      // If the event comes from another Vue Cal instance, it will be deleted automatically in there.
      console.log("EVENT DROP")
      if (external) {
        const extEventToDeletePos = this.$store.state.unplanevents.findIndex(item => item.id === originalEvent.id)
        if (extEventToDeletePos > -1) this.$store.state.unplanevents.splice(extEventToDeletePos, 1)
      }
    },

    showCalendarModal(event, e) {
      this.$bvModal.show('calendar-modal')
      this.modalEvent = event
    },

    hideCalendarModal() {
      this.$bvModal.hide('calendar-modal')
    },
  },


  /* Get From BDD */
  mounted() {
    this.$root.$on('mouse-click-abo', (item) => {
      console.log('on => mouse-click-abo ' + item.index)
    })
    this.$root.$on('mouse-click-marker', (item) => {
      console.log('on => mouse-click-marker')
      console.log(item)
    })

    this.$store.dispatch("loadEvents")
    this.$store.dispatch("loadAgentsCalendar")

    /*
    Colore le calendrier dynamiquement en fonction du nombre d'agents
    */
    let huedelta = Math.trunc(360 / this.$store.state.agentsCalendar.length )
    for (var i = 0; i < this.$store.state.agentsCalendar.length; i++) {
      let hue = i * huedelta
      let divCalendar = document.getElementsByClassName(this.$store.state.agentsCalendar[i].class)
      let divCalendarArray = [...divCalendar]
      divCalendarArray[0].style.backgroundColor = 'hsla(' + hue + ', 100%, 75%, 0.5)'
    }
    //TODO : event oncreate ondelete refresh css with color autrement qu'avec mounted
    console.log(this.events)

  },
  created() {
  },
  beforeMount() {
  },

}
</script>