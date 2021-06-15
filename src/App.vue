<script>
import Sub from "@/components/Sub";
import Header from "@/components/Header";

export default {
  components: { Header, Sub }
}
</script>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
</head>
<template>

  <html lang="fr">
  <div id="app">
  <Header></Header>
    <Sub></Sub>
  </div>
  </html>
</template>


<script>
import Sub from './components/Sub.vue'
import Header from './components/Header.vue'

export default {
  name: 'App',
  components: {
    Sub,
    Header
  },
}

</script>

<style>
 html{
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
