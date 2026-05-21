<template>
  <div class="ud-checkbox" :class="[$attrs.class, { 'is-flex': flex }]" :style="$attrs.style" role="group">
    <template v-if="options">
      <label v-for="option in options" :key="option[valueBy]" :class="{ 'is-disabled': option.disabled }">
        <input
          type="checkbox"
          v-model="value"
          v-bind="filteredAttrs"
          :value="option[valueBy]"
          :disabled="option.disabled"
          @change="onChange"
          ref="checkbox"
        >
        <div class="checkbox-decorator"></div>
        <p v-if="!noLabel">{{ option[labelBy] }}</p>
      </label>
    </template>
    <template v-else>
      <label :class="{ 'is-disabled': disabled }">
        <input
          type="checkbox"
          v-model="value"
          :value="option"
          v-bind="filteredAttrs"
          :disabled="disabled"
          @change="onChange"
          ref="checkbox"
        >
        <div class="checkbox-decorator"></div>
        <p v-if="!noLabel"><slot>{{ option }}</slot></p>
      </label>
    </template>
  </div>
</template>

<script>
export default {
  name: "UdCheckbox",
  inheritAttrs: false,
  props: {
    modelValue: { default: null }, // 綁定值 (單個時綁定Boolean，多個時綁定Array)
    option: { default: true }, // 單選項
    options: { default: null }, // 多選項
    flex: { type: Boolean, default: false }, // 是否並排
    disabled: { type: Boolean, default: false }, // 單選項時是否禁用
    noLabel: { type: Boolean, default: false }, // 是否有label
    labelBy: { type: String, default: "label" }, // label替代值
    valueBy: { type: String, default: "value" }, // value替代值
  },
  computed: {
    filteredAttrs() {
      const { class: classAttr, style, ...attrs } = this.$attrs;
      return attrs;
    },
    value: {
      get() {
        return this.modelValue;
      },
      set(val) {
        this.$emit("update:modelValue", val);
      }
    },
    validOptions() {
      // 過濾掉無效的選項
      return this.options.filter(
        option => option && option[this.valueBy] !== undefined && option[this.valueBy] !== null
      );
    }
  },
  methods: {
    onChange(evt) {
      if (evt && evt.target && evt.target.disabled) return; // 如果選項被禁用，不處理事件
      this.$emit('change', evt.target.value);
      this.$mitt.emit("validate"); // 通知FormItem校驗
    }
  }
};
</script>

<style lang="sass" scoped>
.ud-checkbox
  &.is-flex
    display: flex
    flex-wrap: wrap
    align-items: center
    label
      margin: 0 12px 0 0
  label
    cursor: pointer
    display: flex
    align-items: center
    &.is-disabled
      cursor: not-allowed
      p
        color: #ccc
      .checkbox-decorator
        border: 1px solid #e3e3e3
        background-color: #f3f3f3
        cursor: not-allowed
    p
      font-size: 16px
    input
      position: absolute
      left: -999px
      opacity: 0
      pointer-events: none
      &:checked + .checkbox-decorator
        border-color: #000
        &::before
          background-color: #000
          mask-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M8.76,56.2c-6.38-6.34,3.26-16,9.64-9.69L38,65.88,80.56,23.29c6.38-6.38,16.07,3.32,9.69,9.69L42.84,80.37a6.83,6.83,0,0,1-9.65,0Z"/></svg>')
    .checkbox-decorator
      margin-right: 6px
      flex: 0 0 18px
      width: 18px
      height: 18px
      border-radius: 3px
      border: 1px solid #ccc
      position: relative
      cursor: pointer
      background-color: #fff
      &::before
        content: ""
        display: block
        background-size: contain
        background-position: 100%
        width: 80%
        height: 80%
        box-sizing: border-box
        position: absolute
        left: 50%
        top: 50%
        transform: translate(-50%,-50%)
</style>
