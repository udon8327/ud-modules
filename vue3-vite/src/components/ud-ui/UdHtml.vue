<template>
  <div class="ud-html" v-html="formatHtml"></div>
  <!-- 若要純文字換行，可改用：<div class="ud-html" v-text="text" /> -->
</template>

<script>
import { nl2br } from "@/utils/ud-utils";

export default {
  name: "UdHtml",
  props: {
    text: {
      // 文字(可帶入含標籤的HTML字段)
      type: String,
      default:
        "<h1>H1 用戶自定義訊息</h1><h2>H2 用戶自定義訊息</h2><h3>H3 用戶自定義訊息</h3><h4>H4 用戶自定義訊息</h4><h5>H5 用戶自定義訊息</h5><h6>H6 用戶自定義訊息</h6>\n<p>p 用戶自定義訊息</p><span>span 用戶自定義訊息</span>"
    }
  },
  computed: {
    formatHtml() {
      return nl2br(this.text || "");
    }
  }
};
</script>
