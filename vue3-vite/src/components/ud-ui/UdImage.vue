<template>
  <div class="ud-image">
    <div
      class="ud-image-bg"
      :style="{
        backgroundImage: `url(${currentSrc})`,
        paddingBottom: height + '%',
        borderRadius: radius,
        backgroundSize: bgSize,
        backgroundPosition: bgPosition,
        backgroundRepeat: bgRepeat
      }"
      :aria-label="alt || ''"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script>
import avatarDefault from "@/assets/common/picture/default.jpg";

export default {
  name: "UdImage",
  props: {
    src: { type: String, default: avatarDefault }, // 圖片來源
    height: { type: Number, default: 100 }, // 高度比例
    radius: { type: String, default: "0px" }, // 圓角
    bgSize: { type: String, default: "cover" }, // 背景尺寸[cover, contain, 100%等]
    bgPosition: { type: String, default: "center" }, // 背景位置[center, top, bottom, left, right等]
    bgRepeat: { type: String, default: "no-repeat" }, // 重複方式[no-repeat, repeat, repeat-x, repeat-y等]
    alt: { type: String, default: "" }, // 無障礙說明
    lazy: { type: Boolean, default: false } // 是否懶載入
  },
  data() {
    return {
      avatarDefault,
      currentSrc: avatarDefault,
      _io: null,
      _loadToken: 0
    };
  },
  watch: {
    src: {
      immediate: true,
      handler(val) {
        if (this.lazy) {
          this.setupLazy(val);
        } else {
          this.loadImage(val);
        }
      }
    }
  },
  beforeUnmount() {
    if (this._io) {
      this._io.disconnect();
      this._io = null;
    }
  },
  methods: {
    setupLazy(val) {
      // 若已存在 observer，先解除
      if (this._io) {
        this._io.disconnect();
        this._io = null;
      }
      if (typeof IntersectionObserver === "undefined") {
        // 環境不支援，退回直接載入
        this.loadImage(val);
        return;
      }
      this.$nextTick(() => {
        const el = this.$el;
        if (!el) {
          this.loadImage(val);
          return;
        }
        this._io = new IntersectionObserver(
          entries => {
            for (const entry of entries) {
              if (entry.isIntersecting) {
                this.loadImage(val);
                this._io && this._io.disconnect();
                this._io = null;
                break;
              }
            }
          },
          { rootMargin: "100px" }
        );
        this._io.observe(el);
      });
    },
    loadImage(src) {
      if (!src) {
        this.currentSrc = this.avatarDefault;
        return;
      }

      const token = ++this._loadToken;
      const img = new Image();
      img.decoding = "async";
      img.loading = "eager";
      img.src = src;
      img.onload = () => {
        if (token !== this._loadToken) return; // 已有更新中的載入請求
        this.currentSrc = src;
        this.$emit && this.$emit("load", src);
      };
      img.onerror = () => {
        if (token !== this._loadToken) return;
        this.currentSrc = this.avatarDefault;
        this.$emit && this.$emit("error", src);
      };
    }
  }
};
</script>

<style lang="sass" scoped>
.ud-image
  .ud-image-bg
    overflow: hidden
    width: 100%
    // 由 props.height 控制比例
    height: 0
    background: url('') no-repeat center center
    background-size: cover
    background-color: #e3e3e3
</style>
