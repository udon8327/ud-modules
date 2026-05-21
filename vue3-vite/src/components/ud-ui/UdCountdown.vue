<template>
  <span class="ud-countdown" ref="count" v-html="formatCountTimeHtml"></span>
</template>

<script>
export default {
  name: "UdCountdown",
  props: {
    time: { type: Number, default: 60 }, // 倒數秒數
    delay: { type: Boolean, default: false }, // 延遲倒數
    type: { type: String, default: "second" }, // 時間格式[second, minute]
    text: { type: Boolean, default: false }, // 加上文字
    padMinute: { type: Boolean, default: false }, // 分鐘數補零
    padSecond: { type: Boolean, default: true } // 秒數補零
  },
  data() {
    return {
      countInterval: null,
      countTime: Number.isFinite(this.time) && this.time > 0 ? this.time : 60,
      isPaused: false
    };
  },
  watch: {
    time: {
      immediate: true,
      handler(newTime) {
        // 確保 newTime 是有效數字
        if (Number.isFinite(newTime) && newTime > 0) {
          this.countTime = newTime;
          // 只有在組件已掛載且不是延遲模式時才重新開始倒數
          if (this.$el && !this.delay && !this.isPaused) {
            this.reset();
          }
        }
      }
    }
  },
  computed: {
    formatCountTimeHtml() {
      // 確保 countTime 不是負數
      const safeCountTime = Math.max(0, this.countTime);

      if (this.type === "second") {
        const displayTime = this.padSecond ? this.padStart(safeCountTime) : safeCountTime;
        if (this.text) {
          return `<span class="count-second">${displayTime}</span><span class="count-second-text">秒</span>`;
        } else {
          return `<span class="count-second">${displayTime}</span>`;
        }
      } else if (this.type === "minute") {
        let min = Math.floor(safeCountTime / 60);
        let sec = safeCountTime - min * 60;
        const displayMin = this.padMinute ? this.padStart(min) : min;
        const displaySec = this.padSecond ? this.padStart(sec) : sec;
        if (this.text) {
          return `<span class="count-minute">${displayMin}</span><span class="count-minute-text">分</span><span class="count-second">${displaySec}</span><span class="count-second-text">秒</span>`;
        } else {
          return `<span class="count-minute">${displayMin}</span><span class="count-separator">:</span><span class="count-second">${displaySec}</span>`;
        }
      }
      return `<span class="count-second">${safeCountTime}</span>`;
    }
  },
  mounted() {
    if (!this.delay) this.countdown();
  },
  beforeUnmount() {
    this.cleanup();
  },
  methods: {
    countdown() {
      if (this.countInterval) clearInterval(this.countInterval);
      this.isPaused = false;
      this.countInterval = setInterval(() => {
        if (!this.isPaused) {
          this.countTime -= 1;
          // 防止 countTime 變成負數
          if (this.countTime <= 0) {
            this.countTime = 0;
            this.$emit("timeup");
            this.cleanup();
          }
        }
      }, 1000);
    },
    reset() {
      this.cleanup();
      this.countTime = Number.isFinite(this.time) && this.time > 0 ? this.time : 60;
      this.isPaused = false;
      if (!this.delay) {
        this.countdown();
      }
    },
    pause() {
      this.isPaused = true;
    },
    resume() {
      this.isPaused = false;
    },
    cleanup() {
      if (this.countInterval) {
        clearInterval(this.countInterval);
        this.countInterval = null;
      }
    },
    padStart(val, length = 2, fillChar = "0") {
      if (val == null) return "";
      return val.toString().padStart(length, fillChar.toString());
    }
  }
};
</script>

<style lang="sass" scoped></style>
