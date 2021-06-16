<script>
import Sub from "@/components/Sub";

export default {
  components: { Sub }
}
</script>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
</head>
<template>

  <html lang="fr">
  <div>
    <Sub></Sub>
  </div>

  </html>
</template>


<script>

import Sub from './components/Sub.vue'

import 'bootstrap-vue/dist/bootstrap-vue.css'

export default {
  name: 'App',
  components: {
    Sub
  },
}
</script>
