<template lang="pug">
#app
  header
    img(src="@/assets/common/logo/logo.png")
  .container
    .wrapper
      router-view
</template>

<script setup></script>

<style lang="sass" scoped>
header
  background-color: $main
  height: 72px
  position: relative
  margin-bottom: 15px
  img
    height: 100%
    position: absolute
    left: 50%
    top: 50%
    transform: translate(-50%, -50%)

.container
  max-width: 460px
  margin: 0 auto
  min-height: 100%
  background-color: #fff
  padding: 0 0 60px 0
  .wrapper
    padding: 0 5%
</style>
