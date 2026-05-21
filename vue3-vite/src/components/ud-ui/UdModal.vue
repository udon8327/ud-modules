<template>
  <transition name="fade">
    <div
      class="ud-modal"
      v-if="isShow"
      @click.self="maskHandler"
      :class="{ 'full-screen': fullScreen }"
      :style="{ zIndex: zIndex }"
      role="dialog"
      aria-modal="true"
    >
      <div class="ud-modal-wrapper" :class="{ 'no-bg': noBg }">
        <div class="ud-modal-close" v-if="btnClose" @click="isShow = false">
          <i class="icon-close"></i>
        </div>
        <div class="ud-modal-header" v-if="!$slots.default">
          <p>{{ title }}</p>
        </div>
        <div class="ud-modal-body">
          <p v-if="!$slots.default">{{ message }}</p>
          <slot></slot>
        </div>
        <div class="ud-modal-footer" v-if="!$slots.default">
          <div class="button-area">
            <ud-button @click="isShow = false">確認</ud-button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "UdModal",
  props: {
    modelValue: { type: Boolean, default: false },
    title: { type: String, default: "通用標題" }, // 通用標題(slot為空時)
    message: { type: String, default: "通用訊息" }, // 通用訊息(slot為空時)
    maskClose: { type: Boolean, default: false }, // 點擊遮罩關閉
    btnClose: { type: Boolean, default: false }, // 右上關閉按鈕
    fullScreen: { type: Boolean, default: false }, // 是否全螢幕
    noBg: { type: Boolean, default: false }, // 背景是否透明
    scrollLock: { type: Boolean, default: true }, // 鎖定背景捲動
    zIndex: { type: Number, default: 100 } // z-index層級
  },
  computed: {
    isShow: {
      get() {
        return this.modelValue;
      },
      set(val) {
        this.$emit("update:modelValue", val);
      }
    }
  },
  data() {
    return {
      _prevOverflowY: ""
    };
  },
  watch: {
    isShow(newVal) {
      // 鎖定/還原背景卷動
      if (!this.scrollLock) return;
      if (newVal) {
        this._prevOverflowY = document.body.style.overflowY || "";
        document.body.style.overflowY = "hidden";
      } else {
        document.body.style.overflowY = this._prevOverflowY;
        this._prevOverflowY = "";
      }
    }
  },
  mounted() {
    // 初始狀態若為開啟，套用鎖定
    if (this.scrollLock && this.isShow) {
      this._prevOverflowY = document.body.style.overflowY || "";
      document.body.style.overflowY = "hidden";
    }
  },
  beforeUnmount() {
    if (this.scrollLock) {
      document.body.style.overflowY = this._prevOverflowY;
      this._prevOverflowY = "";
    }
  },
  methods: {
    maskHandler() {
      if (this.maskClose) {
        this.isShow = false;
      }
    }
  }
};
</script>

<style lang="sass" scoped>
.ud-modal
  position: fixed
  z-index: 100
  left: 0
  top: 0
  right: 0
  bottom: 0
  width: 100%
  height: 100%
  background-color: rgba(#000, 0.5)
  display: flex
  justify-content: center
  align-items: center
  overflow-x: hidden
  .ud-modal-wrapper
    position: relative
    width: 85%
    max-width: 380px
    max-height: 88%
    background-color: #fff
    box-shadow: 0px 3px 20px 0px rgba(#000, 0.2)
    border-radius: 0px
    text-align: center
    display: flex
    flex-direction: column
    &.no-bg
      background-color: rgba(#fff, 0)
      box-shadow: 0px 3px 20px 0px rgba(#000, 0)
    .ud-modal-close
      position: absolute
      width: 26px
      height: 26px
      right: 4px
      top: -32px
      cursor: pointer
      &:hover
        .icon-close
          opacity: 1
      .icon-close
        opacity: 0.75
        transition: all 0.2s ease
        &::before, &::after
          position: absolute
          left: 13px
          content: ''
          height: 26px
          width: 2px
          background-color: #fff
        &::before
          transform: rotate(45deg)
        &::after
          transform: rotate(-45deg)
    .ud-modal-header
      flex: 0 0 auto
      padding: 15px
      p
        font-size: 18px
        font-weight: bold
    .ud-modal-body
      flex: 1 1 auto
      padding: 15px
      overflow-y: auto
    .ud-modal-footer
      flex: 0 0 auto
      padding: 15px
  &.full-screen
    .ud-modal-wrapper
      width: 100%
      max-width: 460px
      max-height: 100%
      height: 100%
      overflow: hidden
      box-shadow: none
      border-radius: 0
      will-change: auto
      .ud-modal-body
        padding: 0

.fade-enter-active, .fade-leave-active
  transition: opacity 0.15s ease
.fade-enter-from, .fade-leave-to
  opacity: 0
.fade-enter-to, .fade-leave-from
  opacity: 1
</style>
