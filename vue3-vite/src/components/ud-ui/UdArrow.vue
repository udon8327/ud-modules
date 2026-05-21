<template>
  <i class="ud-arrow" :class="[safeDirection]" :style="elementStyle" aria-hidden="true"></i>
</template>

<script>
export default {
  name: "UdArrow",
  props: {
    color: { type: String, default: "#333" }, // 顏色
    width: { type: [Number, String], default: 3 }, // 寬度
    size: { type: [Number, String], default: 3 }, // 大小
    direction: { type: String, default: "right" }, //方向 [up, down, left, right]
    type: { type: String, default: "hollow" } // 類型 [hollow(中空), solid(實心)]
  },
  computed: {
    normalizedWidth() {
      const n = parseInt(this.width, 10);
      return Number.isFinite(n) && n > 0 ? n : 3;
    },
    normalizedSize() {
      const n = parseInt(this.size, 10);
      return Number.isFinite(n) && n >= 0 ? n : 3;
    },
    safeDirection() {
      const allowed = ["up", "down", "left", "right"];
      return allowed.includes(this.direction) ? this.direction : "right";
    },
    elementStyle() {
      const style = {
        color: this.color,
        display: "inline-block",
        transform: this.type === "solid" ? this.solidTransform : this.hollowTransform
      };
      if (this.type === "hollow") {
        // 以向右為基準的箭頭(^)，再以 transform 調整
        style.borderStyle = "solid";
        style.borderColor = "currentColor";
        style.borderWidth = `0 ${this.normalizedWidth}px ${this.normalizedWidth}px 0`;
        style.padding = `${this.normalizedSize}px`;
      } else {
        // 以向上為基準的實心三角形(▲)，再以 transform 調整
        style.width = 0;
        style.height = 0;
        style.borderStyle = "solid";
        style.borderLeftColor = "transparent";
        style.borderRightColor = "transparent";
        style.borderTopColor = "transparent";
        style.borderBottomColor = "currentColor";
        style.borderLeftWidth = `${this.normalizedSize}px`;
        style.borderRightWidth = `${this.normalizedSize}px`;
        style.borderTopWidth = `0px`;
        style.borderBottomWidth = `${this.normalizedSize}px`;
        style.padding = 0;
      }
      return style;
    },
    hollowTransform() {
      // caret 以向右為基準，使用 -45/45/135 等旋轉
      const map = {
        right: "rotate(-45deg)",
        left: "rotate(135deg)",
        up: "rotate(-135deg)",
        down: "rotate(45deg)"
      };
      return map[this.safeDirection] || map.right;
    },
    solidTransform() {
      // triangle 以向上為基準，使用 0/90/180/-90 旋轉
      const map = {
        up: "rotate(0deg)",
        right: "rotate(90deg)",
        down: "rotate(180deg)",
        left: "rotate(-90deg)"
      };
      return map[this.safeDirection] || map.right;
    }
  }
};
</script>

<style lang="sass" scoped>
.ud-arrow
  display: inline-block
  &.right
    transform: rotate(-45deg)
  &.left
    transform: rotate(135deg)
  &.up
    transform: rotate(-135deg)
  &.down
    transform: rotate(45deg)
</style>
