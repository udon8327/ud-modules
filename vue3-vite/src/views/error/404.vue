<template lang="pug">
#error-404
  .image-area
    img(src="@/assets/common/picture/error.jpg")
  .text-area
    h6 404
    p 很抱歉！#[br]您訪問的頁面不存在
</template>

<script>
export default {
  name: "Error404",
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
