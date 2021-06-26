<template>
  <div class="loading" @touchmove.prevent>
    <van-loading />
  </div>
</template>
<script>
export default {
  name: 'Loading',
}
</script>
<style lang="scss" scoped>
  .loading {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 99;
    background-color: rgba(255,255,255,0);
    display: flex;
    justify-content: center;
    align-items: center;
    .icon-loading {
      font-size: 80px;
    }
  }
</style>
