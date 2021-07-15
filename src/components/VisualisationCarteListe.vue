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
import { mapGetters } from 'vuex'

export default {
  name: 'VisualisationCarteListe',
  components: {VisualisationListe, VisualisationCarte, FullCalendar},
  data() {
    return {
      calendarOptions: {
        plugins: [dayGridPlugin, timeGridPlugin, listPlugin],
        initialView: 'timeGridDay',
        nowIndicator: true,
        themeSystem: 'bootstrap',
        slotMinTime: "08:00:00",
        slotMaxTime: "19:00:00",
        defaultTimedEventDuration : '00:30',
        allDaySlot: false,
        events: this.$store.state.events,
        eventColor: '#5F3075',
        progressiveEventRendering: true,
        weekends:false,
        timeZone: 'fr',
        height: 'auto',
        locale:'fr',
        titleFormat:{month:'long', day:'numeric'},
        headerToolbar:{start:'',center:'title',end:''},
        footerToolbar:{start:'',center:'',end:''},
        buttonText:{today:"Aujourd'hui"}
      }
    }
  },
  computed:{
    ...mapGetters({fullCalendarDateSelected:'selectedDateGetter'})
  },
  watch:{
    // on relie le filtre avec la selection du jour sur le composant calendrier
    fullCalendarDateSelected(){
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
  }
}
</script>