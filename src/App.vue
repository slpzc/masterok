<template>
  <div id="app">
    <navigation/>
    <router-view/>
  </div>
</template>

<style lang="scss">
#app{
  min-height: 100vh;
  font-family: 'Manrope',sans-serif !important;
}

</style>
<script>
import navigation from "@/components/navigation";
export default {
  components: {
    navigation
  },
  mounted() {
    this.$store.commit('authorization', JSON.parse(localStorage.getItem('user')))
  },

}
</script>