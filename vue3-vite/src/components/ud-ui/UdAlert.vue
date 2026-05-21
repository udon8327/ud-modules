<template>
  <transition name="fade">
    <div class="ud-alert" v-if="isShow" @click.self="maskHandler" :style="{ zIndex: zIndex }">
      <div class="ud-modal-wrapper">
        <div class="ud-modal-close" v-if="btnClose" @click="destroy">
          <i class="icon-close"></i>
        </div>
        <div class="ud-modal-header" v-if="title">
          <p v-html="formatHtml(title)"></p>
        </div>
        <div class="ud-modal-body">
          <p v-html="formatHtml(displayMessage)"></p>
        </div>
        <div class="ud-modal-footer">
          <ud-button @click="cancelHandler" plain v-if="confirm">
            {{ cancelText }}
          </ud-button>
          <ud-button @click="confirmHandler">{{ confirmText }}</ud-button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { nl2br } from "@/utils/ud-utils";
import UdButton from "./UdButton.vue";

export default {
  name: "UdAlert",
  components: { UdButton },
  props: {
    title: { type: String, default: "" }, // 標題文字
    message: { type: [String, Number, Boolean], default: "" }, // 訊息文字(功能同msg，接受html語法)
    msg: { type: [String, Number, Boolean], default: "" }, // 訊息文字(功能同message，接受html語法)
    maskClose: { type: Boolean, default: false }, // 點擊遮罩關閉
    btnClose: { type: Boolean, default: false }, // 右上關閉按鈕
    confirm: { type: Boolean, default: false }, // 是否有確認+取消鈕
    confirmText: { type: String, default: "確定" }, // 確認鈕文字
    onConfirm: { type: Function, default: () => {} }, // 確認鈕callback(也可使用.then)
    cancelText: { type: String, default: "取消" }, // 取消鈕文字
    onCancel: { type: Function, default: () => {} }, // 取消鈕callback(也可使用.catch)
    scrollLock: { type: Boolean, default: true }, // 是否鎖定背景頁面捲動
    zIndex: { type: Number, default: 120 } // z-index層級
  },
  data() {
    return {
      isShow: false, // 是否顯示
      resolve: null, // 保存resolve
      reject: null, // 保存reject
      _prevOverflowY: "",
      _isDestroyed: false // 防止重複銷毀
    };
  },
  computed: {
    displayMessage() {
      // 修正邏輯：優先使用 message，如果 message 為空或未定義則使用 msg
      if (this.message !== "" && this.message != null) {
        return this.message;
      }
      return this.msg;
    }
  },
  mounted() {},
  beforeUnmount() {
    // 組件銷毀前清理
    this.cleanup();
  },
  methods: {
    show() {
      if (this._isDestroyed) {
        console.warn("[UdAlert] Component is already destroyed");
        return Promise.reject("Component destroyed");
      }

      if (this.scrollLock) {
        this._prevOverflowY = document.body.style.overflowY || "";
        document.body.style.overflowY = "hidden";
      }

      // 使用 nextTick 確保 transition 能夠正確觸發
      return this.$nextTick(() => {
        this.isShow = true;
        return new Promise((resolve, reject) => {
          this.resolve = resolve;
          this.reject = reject;
        });
      });
    },
    formatHtml(val) {
      return nl2br(val);
    },
    confirmHandler() {
      if (this._isDestroyed) return;

      try {
        this.onConfirm();
      } catch (e) {
        console.error("[UdAlert] onConfirm error:", e);
      }

      if (this.resolve) {
        this.resolve("confirm");
      }
      this.destroy();
    },
    cancelHandler() {
      if (this._isDestroyed) return;

      try {
        this.onCancel();
      } catch (e) {
        console.error("[UdAlert] onCancel error:", e);
      }

      if (this.reject) {
        this.reject("cancel");
      }
      this.destroy();
    },
    maskHandler() {
      if (this.maskClose && !this._isDestroyed) {
        this.destroy();
      }
    },
    destroy() {
      if (this._isDestroyed) return;

      this._isDestroyed = true;
      this.isShow = false;

      // 恢復滾動
      if (this.scrollLock) {
        document.body.style.overflowY = this._prevOverflowY;
        this._prevOverflowY = "";
      }

      // 清理 Promise 引用
      this.resolve = null;
      this.reject = null;

      // 使用 Vue 3 的正確方式卸載組件
      this.$nextTick(() => {
        if (this.$el && this.$el.parentNode) {
          this.$el.parentNode.removeChild(this.$el);
        }
      });
    },
    cleanup() {
      // 清理方法，用於 beforeUnmount
      if (!this._isDestroyed) {
        this.destroy();
      }
    }
  }
};
</script>

<style lang="sass" scoped>
// Transition styles for fade effect
.fade-enter-active, .fade-leave-active
  transition: opacity 0.2s ease
.fade-enter-from, .fade-leave-to
  opacity: 0
.fade-enter-to, .fade-leave-from
  opacity: 1

.ud-alert
  position: fixed
  z-index: 120
  left: 0
  top: 0
  right: 0
  bottom: 0
  width: 100%
  height: 100%
  background-color: rgba(0, 0, 0, 0.5)
  display: flex
  justify-content: center
  align-items: center
  overflow-x: hidden
  .ud-modal-wrapper
    position: relative
    padding: 15px
    width: 90%
    max-width: 400px
    max-height: 88%
    background-color: #fff
    box-shadow: 0px 3px 20px 0px rgba(0, 0, 0, 0.3)
    text-align: center
    display: flex
    flex-direction: column
    p
      font-size: 16px
      margin-bottom: 0
      color: #333
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
      padding: 0 0 15px 0
      p
        font-size: 18px
        font-weight: bold
    .ud-modal-body
      flex: 1 1 auto
      padding: 5px 15px
      margin: 0 -15px
      overflow-y: auto
    .ud-modal-footer
      flex: 0 0 auto
      padding: 15px 0 0 0
      display: flex
      justify-content: center
      align-items: center
      .ud-button
        flex: 1 1 50%
        max-width: 50%
      >.ud-button + .ud-button
        margin-left: 15px
</style>
