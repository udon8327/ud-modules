<template>
  <div class="ud-button" :class="$attrs.class" :style="$attrs.style">
    <button
      ref="button"
      v-bind="filteredAttrs"
      :type="type"
      :disabled="disabled || loading"
      :class="{
        'is-disabled': disabled || loading,
        'is-plain': plain,
        'is-round': round,
        'is-circle': circle
      }"
      @click="onClick"
    >
      <div class="ud-button-wrapper">
        <span><slot>按鈕</slot></span>
        <div class="ud-button-icon" v-if="loading || icon || image">
          <div class="ud-icon-loading" v-if="loading"></div>
          <i :class="icon" v-if="icon && !loading"></i>
          <img :src="image" alt="" v-if="image && !loading" />
        </div>
      </div>
    </button>
  </div>
</template>

<script>
import { throttle, debounce } from "lodash";

export default {
  name: "UdButton",
  inheritAttrs: false,
  props: {
    type: { type: String, default: "button" }, // 按鈕類型
    icon: { type: String, default: "" }, // CSS的icon
    image: { type: String, default: "" }, // 圖片的icon
    loading: { type: Boolean, default: false }, // 載入中
    disabled: { type: Boolean, default: false }, // 禁止點擊
    plain: { type: Boolean, default: false }, // 線條化
    round: { type: Boolean, default: false }, // 圓角
    circle: { type: Boolean, default: false }, // 圓形
    throttle: { type: Boolean, default: false }, // 節流模式，將幾秒內的點擊合為一次
    debounce: { type: Boolean, default: false }, // 防抖模式，幾秒間隔內最多觸發一次
    delay: { type: Number, default: 1000 } // 節流防抖間隔時間
  },
  computed: {
    filteredAttrs() {
      const { class: classAttr, style, onClick, ...attrs } = this.$attrs;
      return attrs;
    }
  },
  data() {
    return {
      _wrappedEmit: null
    };
  },
  methods: {
    _createWrappedEmit() {
      const base = evt => this.$emit("click", evt);
      if (this.throttle) return throttle(base, this.delay, { trailing: false });
      if (this.debounce) return debounce(base, this.delay);
      return base;
    },
    onClick(evt) {
      if (this.disabled || this.loading) return;
      if (!this._wrappedEmit) this._wrappedEmit = this._createWrappedEmit();
      this._wrappedEmit(evt);
    }
  },
  watch: {
    throttle() {
      this._wrappedEmit = this._createWrappedEmit();
    },
    debounce() {
      this._wrappedEmit = this._createWrappedEmit();
    },
    delay() {
      this._wrappedEmit = this._createWrappedEmit();
    }
  },
  mounted() {
    this._wrappedEmit = this._createWrappedEmit();
  }
};
</script>

<style lang="sass" scoped>
.ud-button
  button
    background-color: $main
    border: 1px solid $main
    color: #fff
    padding: 10px
    border-radius: 5px
    width: 100%
    min-width: 0px
    max-width: 100%
    cursor: pointer
    box-shadow: none
    appearance: none
    text-align: center
    outline: none !important
    transition: all 0.2s ease
    position: relative
    .ud-button-wrapper
      display: inline-flex
      justify-content: center
      align-items: center
      position: relative
      span
        font-size: 16px
      .ud-button-icon
        position: absolute
        left: -32px
        top: 50%
        transform: translate(0%, -50%)
        display: flex
        justify-content: center
        align-items: center
        i
          font-size: 24px
        img
          width: 24px
          height: 24px
        .ud-icon-loading
          border: 2px solid rgba(#fff, 0.2)
          border-top: 2px solid #fff
          border-radius: 50%
          width: 24px
          height: 24px
          animation: spin .5s linear infinite
          @keyframes spin
            0%
              transform: rotate(0deg)
            100%
              transform: rotate(360deg)
    &:hover, &:focus
      opacity: 0.85
    &.is-plain
      background-color: #fff
      border: 1px solid $main
      color: $main
      &:hover,&:focus
        background-color: $main
        border: 1px solid $main
        color: #fff
    &.is-disabled
      background-color: #ddd
      border: 1px solid #ccc
      color: #888
      cursor: not-allowed
    &.is-round
      border-radius: 50px
    &.is-circle
      border-radius: 50%
      width: 40px
      height: 40px
</style>
