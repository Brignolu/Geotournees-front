<template>
  <div class="my-1 mx-1">
    <b-row class="px-0">
      <b-col md="3" sm="12" lg="3" xl="3">
        <VisualisationCarte></VisualisationCarte>
      </b-col>
      <b-col md="9" sm="12" lg="7" xl="7">
        <VisualisationListe></VisualisationListe>
      </b-col>
      <b-col md="0" lg="2" xl="2">
        <FullCalendar ref="fullCalendar" :options="calendarOptions"></FullCalendar>
      </b-col>
    </b-row>
    <b-row>
      <vue-cal hide-weekends
               :time-from="8 * 60"
               :time-to="19 * 60"
               active-view="day"
               :time="true"
               :editable-events="{ title: true, drag:true, resize: true, delete: true, create: true }"
               :snap-to-time="15" hide-view-selector
               :events="events"
               disable-views="['years','year','month']"/>
    </b-row>
    <b-modal id="calendar-modal" centered hide-footer title="Interventions">
      <div class="d-block text-center">
        <h4> oui </h4>
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
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'
import {mapGetters} from 'vuex'

export default {
  name: 'VisualisationCarteListe',
  components: {VisualisationListe, VisualisationCarte, FullCalendar, VueCal},
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
        draggable: true
      },
        {
          start: '2021-09-22 14:00',
          end: '2021-09-22 16:45',
          title: 'Intervention Mme MUGNIER',
          content: 'Attention chien méchant',
          class: 'red-event',
          deletable: false,
          resizable: false,
          draggable: false
        }],
      calendarOptions: {
        plugins: [dayGridPlugin, timeGridPlugin, listPlugin],
        initialView: 'timeGridDay',
        nowIndicator: true,
        themeSystem: 'bootstrap',
        slotMinTime: "08:00:00",
        slotMaxTime: "19:00:00",
        defaultTimedEventDuration: '00:30',
        allDaySlot: false,
        events: this.$store.state.events,
        eventColor: '#5F3075',
        progressiveEventRendering: true,
        weekends: false,
        timeZone: 'fr',
        height: 'auto',
        locale: 'fr',
        titleFormat: {month: 'long', day: 'numeric'},
        headerToolbar: {start: '', center: 'title', end: ''},
        footerToolbar: {start: '', center: '', end: ''},
        buttonText: {today: "Aujourd'hui"},
        dateClick: this.showCalendarModal,
      }
    }
  },
  computed: {
    ...mapGetters({fullCalendarDateSelected: 'selectedDateGetter'})
  },
  watch: {
    // on relie le filtre avec la selection du jour sur le composant calendrier
    fullCalendarDateSelected() {
      let fcapi = this.$refs.fullCalendar.getApi()
      fcapi.gotoDate(this.fullCalendarDateSelected)
    }
  },
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
  created() {
    this.$store.dispatch("loadEvents")
  },
  showCalendarModal() {
    this.$bvModal.show('calendar-modal')
  },
  hideCalendarModal() {
    this.$bvModal.hide('calendar-modal')
  },
}
</script>