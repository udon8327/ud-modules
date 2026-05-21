<template lang="pug">
#app-footer
  p Copyright © {{ new Date().getFullYear() }} {{ brandName }}.
</template>

<script>
export default {
  name: "AppFooter",
  components: {},
  data() {
    return {};
  },
  computed: {
    brandName() {
      return import.meta.env.VITE_API_BRAND_NAME;
    }
  },
  mounted() {},
  methods: {}
};
</script>

<style lang="sass" scoped>
#app-footer
  position: fixed
  bottom: 0
  width: 100%
  text-align: center
  background-color: #fff
  p
    padding: 6px
    font-size: 12px
    line-height: 12px
</style>
