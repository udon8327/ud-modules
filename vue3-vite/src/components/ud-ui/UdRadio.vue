<template>
  <div class="ud-radio" :class="[$attrs.class, { 'is-flex': flex }]" :style="$attrs.style" role="radiogroup">
    <template v-if="options && options.length > 0">
      <label v-for="option in validOptions" :key="option[valueBy]" :class="{ 'is-disabled': option.disabled }">
        <input
          type="radio"
          v-model="value"
          v-bind="filteredAttrs"
          :name="groupName"
          :value="option[valueBy]"
          :disabled="option.disabled"
          @change="onChange"
          :aria-checked="String(value) === String(option[valueBy])"
          role="radio"
        />
        <div class="radio-decorator" :style="{ 'border-radius': radius }"></div>
        <p>{{ option[labelBy] }}</p>
      </label>
    </template>
  </div>
</template>

<script>
export default {
  name: "UdRadio",
  inheritAttrs: false,
  props: {
    modelValue: { default: null }, // 綁定值
    options: { type: Array, default: () => [] }, // 選項[object]
    flex: { type: Boolean, default: false }, // 是否並排
    radius: { type: String, default: "50px" }, // 圓角
    labelBy: { type: String, default: "label" }, // label替代值
    valueBy: { type: String, default: "value" } // value替代值
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
    groupName() {
      // 若外部未提供 name，為本組 radio 生成唯一名稱，避免與其它組衝突
      return this.$attrs.name || this._uidName;
    },
    validOptions() {
      // 過濾掉無效的選項
      return this.options.filter(
        option => option && option[this.valueBy] !== undefined && option[this.valueBy] !== null
      );
    }
  },
  data() {
    return {
      _uidName: `ud-radio-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    };
  },
  methods: {
    onChange(evt) {
      // 如果選項被禁用，不處理事件
      if (evt && evt.target && evt.target.disabled) return;

      this.$mitt && this.$mitt.emit && this.$mitt.emit("validate"); // 通知FormItem校驗

      // 找到對應的選項，使用原始值而不是字符串值
      const selectedValue = evt && evt.target ? evt.target.value : this.modelValue;
      const selectedOption = this.options.find(option => String(option[this.valueBy]) === String(selectedValue));
      const actualValue = selectedOption ? selectedOption[this.valueBy] : selectedValue;

      this.$emit("update:modelValue", actualValue);
      this.$emit("change", actualValue);
    }
  }
};
</script>

<style lang="sass" scoped>
.ud-radio
  &.is-flex
    display: flex
    flex-wrap: wrap
    align-items: center
    label
      margin: 0 12px 0 0
  label
    margin-bottom: 5px
    cursor: pointer
    display: flex
    align-items: center
    &.is-disabled
      cursor: not-allowed
      p
        color: #ccc
      .radio-decorator
        border: 1px solid #e3e3e3
        background-color: #f3f3f3
        cursor: not-allowed
    p
      font-size: 15px
      line-height: 20px
    input
      position: absolute
      left: -999px
      opacity: 0
      pointer-events: none
      &:checked + .radio-decorator
        border-color: #000
        &::before
          background-color: #000
    .radio-decorator
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
        border-radius: 1em
        background-size: contain
        background-position: 100%
        width: 50%
        height: 50%
        box-sizing: border-box
        position: absolute
        left: 50%
        top: 50%
        transform: translate(-50%,-50%)
</style>
