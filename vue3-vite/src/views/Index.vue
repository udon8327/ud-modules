<template lang="pug">
#index
  .test-area.mb-2
    ud-input(v-model="test")
    p {{ test }}
  ud-button.mb-2(@click="toUrl('/demo')") ud-modules
  ud-button.mb-2(@click="toUrl('/test')") ud-modules測試
  ud-button.mb-2(@click="toUrl('/tree-demo')") 漸進式訊息
  ud-button.mb-2(@click="toUrl('/camera-demo')") 開相機
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();

const test = ref("");
const toUrl = url => {
  router.push(url);
};
</script>

<style lang="sass" scoped></style>
