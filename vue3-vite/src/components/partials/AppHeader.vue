<template lang="pug">
#app-header
  img(src="@/assets/common/logo/logo.png")
</template>

<script>
export default {
  name: "AppHeader",
  components: {},
  data() {
    return {};
  },
  mounted() {},
  methods: {}
};
</script>

<style lang="sass" scoped>
#app-header
  position: fixed
  width: 100%
  background-color: $coolbeBg
  height: 72px
  display: flex
  justify-content: center
  align-items: center
  z-index: 10
  img
    height: 100%
</style>
