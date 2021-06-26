<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
    <Loding v-if="loading"></Loding>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import Loding from './components/Loading.vue'

export default {
  components: {
    Loding
  },
  computed: {
    ...mapState(['loading'])
  }
}
</script>
<style lang="scss">
@import "../src/assets/css/main.css";
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
  color: #333333;
  font-family: PingFangSC-Regular, PingFang SC;
  background-color: #f4f4f4;
}
</style>
