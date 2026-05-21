<template>
  <div class="ud-collapse" :style="{ height: height, transitionDuration: durationSecond }">
    <div class="ud-collapse-wrapper" ref="wrapper">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "UdCollapse",
  props: {
    modelValue: { type: Boolean, default: false },
    duration: { type: Number, default: 0.2 }, // 開闔速度
    observe: { type: Boolean, default: false } // 是否在展開時偵測內容高度變化並同步高度
  },
  data() {
    return {
      isShow: this.modelValue,
      height: "0px"
    };
  },
  computed: {
    durationSecond() {
      return `${this.duration}s`;
    }
  },
  watch: {
    modelValue(newVal) {
      this.isShow = newVal;
    },
    isShow() {
      this.$nextTick(() => {
        this.collapse();
        this.$emit("update:modelValue", this.isShow);
        this.$emit("switch", this.isShow);
      });
    }
  },
  mounted() {
    if (this.isShow) {
      this.height = this.$refs.wrapper.clientHeight + "px";
    }
    if (this.observe && typeof ResizeObserver !== "undefined") {
      this._ro = new ResizeObserver(() => {
        if (this.isShow && this.$refs.wrapper) {
          this.height = this.$refs.wrapper.clientHeight + "px";
        }
      });
      this._ro.observe(this.$refs.wrapper);
    }
  },
  beforeUnmount() {
    if (this._ro) {
      this._ro.disconnect();
      this._ro = null;
    }
  },
  methods: {
    open() {
      this.isShow = true;
    },
    close() {
      this.isShow = false;
    },
    toggle() {
      this.isShow = !this.isShow;
    },
    collapse() {
      if (this.isShow) {
        this.height = this.$refs.wrapper.clientHeight + "px";
      } else {
        this.height = "0px";
      }
    },
    // 對外提供手動刷新高度，不改變動畫行為
    refresh() {
      if (this.$refs.wrapper) {
        this.height = this.$refs.wrapper.clientHeight + "px";
      }
    }
  }
};
</script>

<style scoped lang="sass">
.ud-collapse
  overflow: hidden
  will-change: auto
</style>
