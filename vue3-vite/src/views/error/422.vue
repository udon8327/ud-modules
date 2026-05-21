<template lang="pug">
#error-422
  .image-area
    img(src="@/assets/common/picture/error.jpg")
  .text-area
    h6 422
    p 很抱歉！#[br]您沒有權限存取...
</template>

<script>
export default {
  name: "Error422",
  components: {},
  data() {
    return {};
  },
  mounted() {},
  methods: {}
};
</script>

<style lang="sass" scoped>
.image-area
  padding: 60px 5% 0px 5%
.text-area
  text-align: center
  h6
    font-size: 40px
    margin-bottom: 20px
    letter-spacing: 1px
    color: #2c4e94
  p
    font-size: 18px
    letter-spacing: 1px
</style>
