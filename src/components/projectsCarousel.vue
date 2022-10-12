<template>
  <swiper v-ref:swiper
          direction="horizontal"
          :mousewheel-control="true"
          :performance-mode="false"
          :pagination-visible="true"
          :pagination-clickable="true"
          :loop='true'
          @slide-change-start="onSlideChangeStart"
          @slide-change-end="onSlideChangeEnd">
    <div>Page 1</div>
    <div>Page 2</div>
    <div>Page 3</div>
  </swiper>
</template>

<script>
import Swiper from 'vue-swiper'

export default {
  name: "projectsCarousel",
  components: {Swiper},
  methods: {
    onSlideChangeStart (currentPage) {
      console.log('onSlideChangeStart', currentPage);
    },
    onSlideChangeEnd (currentPage) {
      console.log('onSlideChangeEnd', currentPage);
    }
  }
}
</script>

<style scoped>

</style>