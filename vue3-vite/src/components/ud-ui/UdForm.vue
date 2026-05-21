<template>
  <div class="ud-form" :class="{ 'is-no-error-msg': noErrorMsg }">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "UdForm",
  provide() {
    return {
      registerFormItem: this.registerFormItem,
      unregisterFormItem: this.unregisterFormItem,
      form: this // 傳遞Form實例给後代，比如FormItem用來校驗
    };
  },
  data() {
    return {
      submitLock: true,
      formItems: [] // 管理子元件實例
    };
  },
  props: {
    model: { type: Object, default: () => ({}) }, // 驗證資料
    rules: { type: Object, default: () => ({}) }, // 驗證規則
    noErrorMsg: { type: Boolean, default: false }, // 有無錯誤提示
    noErrorScroll: { type: Boolean, default: false } // 驗證時不滾動至錯誤項目
  },
  beforeUnmount() {
    // 清理所有表單項目
    this.formItems = [];
  },
  methods: {
    registerFormItem(item) {
      if (item && !this.formItems.includes(item)) {
        this.formItems.push(item);
      }
    },
    unregisterFormItem(item) {
      if (item) {
        this.formItems = this.formItems.filter(i => i !== item);
      }
    },
    validate(
      successCb = () => {
        console.log("驗證成功！");
      },
      failedCb = () => {
        console.error("驗證未通過");
      }
    ) {
      this.submitLock = false;
      const tasks = this.formItems.filter(item => item.prop).map(item => item.validate(true));
      // console.log('tasks: ', tasks);
      Promise.all(tasks)
        .then(() => {
          successCb();
        })
        .catch(() => {
          if (!this.noErrorScroll) {
            this.$nextTick(() => {
              const firstError = document.querySelector(".is-error");
              if (firstError) {
                this.scrollTo(firstError, 5, -10);
              }
            });
          }
          failedCb();
        });
    },
    clearValidate() {
      this.formItems.forEach(item => {
        if (item && typeof item.clearValidate === "function") {
          item.clearValidate();
        }
      });
    },
    scrollTo(el = "top", speed = 5, offset = 0, callback = () => {}) {
      const scroller = document.scrollingElement || document.documentElement || document.body;
      let current = scroller.scrollTop;
      let target = 0;

      if (typeof el === "number") {
        target = el + offset;
      } else if (typeof el === "string") {
        if (el === "top") {
          target = 0 + offset;
        } else if (el === "bottom") {
          target = scroller.scrollHeight - window.innerHeight + offset;
        } else {
          const found = document.querySelector(el);
          if (found) {
            const rect = found.getBoundingClientRect();
            target = current + rect.top + offset;
          }
        }
      } else if (el instanceof HTMLElement) {
        const rect = el.getBoundingClientRect();
        target = current + rect.top + offset;
      }

      // Clamp to valid range
      target = Math.max(0, Math.min(target, scroller.scrollHeight - window.innerHeight));

      // 如果目標位置與當前位置相同，直接執行回調
      if (Math.abs(current - target) <= 1) {
        callback && callback();
        return;
      }

      const step = () => {
        current += (target - current) / speed;
        if (Math.abs(current - target) <= 1) {
          scroller.scrollTop = target;
          callback && callback();
          return;
        }
        scroller.scrollTop = current;
        requestAnimationFrame(step);
      };
      step();
    }
  }
};
</script>

<style lang="sass" scoped>
.ud-form
  &.is-no-error-msg
    :deep(.ud-form-item)
      &.is-error
        .ud-form-item-right
          >div
            input,textarea,select
              border: 1px solid #cecece
              &:focus
                border: 1px solid #cecece
          >p.error-message
            display: none
</style>
