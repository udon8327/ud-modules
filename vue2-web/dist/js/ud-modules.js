/*
==================== ud-modules 常用組件 ====================
Form
  ud-button：按鈕
  ud-input：輸入框
  ud-textarea：多行輸入框
  ud-radio：單選框
  ud-checkbox：多選框
  ud-select：下拉框
  ud-select-date：日期連動下拉框
  ud-select-twzip：台灣行政區連動下拉框
  ud-switch：開關
  ud-form-item：表單驗證容器
  ud-form：表單驗證

Layout
  ud-arrow：CSS箭頭
  ud-collapse：摺疊容器
  ud-image：等比例自適應圖片

Notice
  ud-alert：警告彈窗
  ud-modal：通用彈窗
  ud-loading：載入中

Tools
  ud-html：自定義訊息
  ud-ellipsis：文字省略
  ud-countdown：倒數計時

==================== ud-utils 常用函式 ====================
String
  nl2br：將字串內換行符\n轉為<br>
  getRandomString：取得隨機字串
  copyText：複製文字至剪貼簿

Number
  getRandom：取得範圍內隨機整數
  formatNumber：數字加入千分位逗號
  padStart：數字補零

Image
  imageLoaded：單張圖片載入完成
  imageAllLoaded：多張圖片載入完成
  imageDownload：下載Img圖片

Array
  isArrayRepeat：陣列是否有重複值(不分型別)
  removeArrayRepeat：移除陣列中的重複元素
  indexOfAll：返回陣列中某值的所有索引

Object
  typeOf：精準型別判斷
  deepClone：深拷貝
  renameKeys：物件key重命名

Time
  isExistDate：判斷日期是否存在
  getDiffDate：取得前後幾天的日期
  formatTime：時間格式化

DOM
  scrollToTarget：滾動至指定位置
  getPageScroll：取得頁面當前捲動高度(寬度)
  getPageSize：取得頁面尺寸

Verify
  isVerify：常用驗證函式
  isNumber：精準數字驗證
  isEmpty：未填入驗證

Web
  debounce：函式防抖
  throttle：函式節流
  queryString：查詢網址所帶參數
  isMobile：判斷是否移動裝置
*/

//-----------------------Form-----------------------
// ud-button：按鈕
Vue.component('ud-button', {
  name: 'UdButton',
  template: `
    <div class="ud-button">
      <button
        v-bind="$attrs"
        :type="type"
        :disabled="disabled || loading"
        :class="{
          'is-disabled': disabled || loading,
          'is-plain': plain,
          'is-round': round,
          'is-circle': circle
        }"
      >
        <div class="ud-button-wrapper">
          <span><slot>按鈕</slot></span>
          <div class="ud-button-icon">
            <div class="ud-icon-loading" v-if="loading"></div>
            <i :class="icon" v-if="icon && !loading"></i>
            <img :src="image" alt="" v-if="image && !loading">
            <slot name="icon" v-if="!loading"></slot>
          </div>
        </div>
      </button>
    </div>
  `,
  inheritAttrs: false,
  props: {
    type: { default: 'button' }, // 按鈕類型
    icon: { default: '' }, // CSS的icon
    image: { default: '' }, // 圖片的icon
    loading: Boolean, // 載入中
    disabled: Boolean, // 禁止點擊
    plain: Boolean, // 線條化
    round: Boolean, // 圓角
    circle: Boolean, // 圓型
    throttle: Boolean, // 節流模式
    debounce: Boolean, // 防抖模式
    delay: { default: 1000 } // 節流/防抖 時間
  },
  mounted() {
    let handler = this.baseClickHandler;
    if (this.throttle) {
      handler = throttle(handler, this.delay);
    } else if (this.debounce) {
      handler = debounce(handler, this.delay);
    }
    this.$el.addEventListener('click', handler);
  },
  methods: {
    baseClickHandler(evt) {
      if (this.disabled || this.loading) return;
      this.$emit('click', evt);
    },
  },
})

// ud-input：輸入框
Vue.component('ud-input', {
  name: 'UdInput',
  template: `
    <div class="ud-input">
      <input
        ref="input"
        v-model="modelValue"
        v-bind="$attrs"
        :class="{ 'is-center': center }"
        @input="onInput"
        @change="$emit('change', $event)"
        @focus="$emit('focus', $event)"
        @blur="$emit('blur', $event)"
        @keydown="$emit('keydown', $event)"
        @keyup="$emit('keyup', $event)"
        @keypress="$emit('keypress', $event)"
        @paste="$emit('paste', $event)"
        @cut="$emit('cut', $event)"
        @copy="$emit('copy', $event)"
      >
      <slot></slot>
    </div>
  `,
  inheritAttrs: false,
  props: {
    value: null,
    center: Boolean // 是否置中
  },
  computed: {
    modelValue: {
      get(){ return this.value == null ? "" : this.value },
      set(val){ this.$emit('input', val) }
    },
  },
  mounted() {
  },
  methods: {
    onInput() {
      this.$parent.$emit('validate'); // 通知FormItem校驗
    },
    focus() {
      this.$refs.input.focus();
    },
    blur() {
      this.$refs.input.blur();
    }
  }
})

// ud-textarea：多行輸入框
Vue.component('ud-textarea', {
  name: "UdTextarea",
  template: `
    <div class="ud-textarea">
      <textarea
        ref="textarea"
        v-model="modelValue"
        v-bind="$attrs"
        :rows="rows"
        :maxlength="limit"
        :class="{ 'is-no-resize': noResize }"
        @input="onInput"
        @change="$emit('change', $event)"
        @focus="$emit('focus', $event)"
        @blur="$emit('blur', $event)"
        @keydown="$emit('keydown', $event)"
        @keyup="$emit('keyup', $event)"
        @keypress="$emit('keypress', $event)"
        @paste="$emit('paste', $event)"
        @cut="$emit('cut', $event)"
        @copy="$emit('copy', $event)"
      >
      </textarea>
      <div class="textarea-limit" v-if="showLimit" :class="{ 'limit-input': value.length > 0 }">
        <span>{{ valueLength }}/{{ limit }}</span>
      </div>
    </div>
  `,
  inheritAttrs: false,
  props: {
    value: null,
    rows: { default: 4 }, // 預設行數
    showLimit: Boolean, // 是否顯示字數限制(與limit併用)
    limit: { default: 0 }, // 字數限制
    noResize: Boolean // 禁止改變大小
  },
  computed: {
    modelValue: {
      get(){ return this.value == null ? "" : this.value },
      set(val){ this.$emit('input', val) }
    },
    valueLength() {
      return this.value.length;
    },
  },
  methods: {
    onInput() {
      this.$parent.$emit('validate'); // 通知FormItem校驗
    },
    focus() {
      this.$refs.textarea.focus();
    },
    blur() {
      this.$refs.textarea.blur();
    }
  }
})

// ud-radio：單選框
Vue.component('ud-radio', {
  name: "UdRadio",
  template: `
    <div class="ud-radio" :class="{'is-flex': flex}">
      <label v-for="option in options" :key="option.value">
        <input
          type="radio"
          v-model="modelValue"
          :value="option.value"
          v-bind="$attrs"
          @change="onChange"
          ref="radio"
          :disabled="option.disabled"
        >
        <div class="radio-decorator"></div>
        <p>{{ combine ? option.value : option.label }}</p>
      </label>
    </div>
  `,
  inheritAttrs: false,
  props: {
    value: null, // value值
    options: { // 選項 | Array
      default: null,
    },
    flex: Boolean, // 是否並排
    combine: Boolean // 使用value做為label
  },
  computed: {
    modelValue: {
      get(){ return this.value },
      set(val){ this.$emit('input', val) }
    }
  },
  methods: {
    onChange() {
      this.$parent.$emit('validate'); // 通知FormItem校驗
      this.$emit('change', this.$refs.radio.value);
    }
  }
})

// ud-checkbox：多選框
Vue.component('ud-checkbox', {
  name: "UdCheckbox",
  template: `
    <div class="ud-checkbox" :class="{'is-flex': flex}">
      <template v-if="typeof(options) === 'string' || options === null">
        <label>
          <input
            type="checkbox"
            v-model="modelValue"
            :value="options"
            v-bind="$attrs"
            @change="onChange"
            ref="checkbox"
          >
          <div class="checkbox-decorator" :class="{'is-solid': solid}"></div>
          <p><slot>{{ options }}</slot></p>
        </label>
      </template>
      <template v-else>
        <label v-for="option in options" :key="option.value">
          <input
            type="checkbox"
            :value="option.value"
            v-model="modelValue"
            v-bind="$attrs"
            @change="onChange"
            ref="checkbox"
            :disabled="option.disabled"
          >
          <div class="checkbox-decorator" :class="{'is-solid': solid}"></div>
          <p>{{ combine ? option.value : option.label }}</p>
        </label>
      </template>
    </div>
  `,
  inheritAttrs: false,
  props: {
    value: null, // value值 單個時綁定Boolean 多個時綁定Array
    options: { // 選項 | Array、String
      default: null,
    },
    flex: Boolean, // 是否並排
    combine: Boolean, // 使用value做為label
    solid: Boolean, // 打勾改為實心
  },
  computed: {
    modelValue: {
      get(){ return this.value },
      set(val){ this.$emit('input', val) }
    }
  },
  methods: {
    onChange() {
      this.$parent.$emit('validate'); // 通知FormItem校驗
      this.$emit('change', this.$refs.checkbox.value);
    }
  }
})

// ud-select：下拉框
Vue.component('ud-select', {
  name: "UdSelect",
  template: `
    <div class="ud-select">
      <select 
        v-model="modelValue" 
        :data-placeholder-selected="modelValue.length === 0"
        v-bind="$attrs"
        @change="onChange"
        ref="select"
        :class="{ center: center }"
      >
        <option value="" disabled selected>{{ placeholder }}</option>
        <option v-for="option in optionsArr" :value="option[valueBy]" :key="option[valueBy]" :disabled="option.disabled">
          {{ combine ? option[valueBy] : option[labelBy] }}
        </option>
      </select>
    </div>
  `,
  inheritAttrs: false,
  props: {
    value: { default: "" }, // value值
    options: { // 選項
      default: () => {
        return [
          { label: "", value: "", disabled: true }
        ]
      }
    },
    placeholder: { default: "請選擇一項" }, // 取代文字
    combine: Boolean, // 使用value做為label
    center: Boolean, // 文字是否置中
    group: { default: "" }, // 組成群組(雙向綁定的值所組成的陣列)
    index: { default: 0 }, // 群組索引(由0開始的數字)
    labelBy: { default: "label" }, // label替代值
    valueBy: { default: "value" }, // value替代值
    childrenBy: { default: "children" }, // children替代值
  },
  data() {
    return {
      groupWatch: []
    }
  },
  computed: {
    modelValue: {
      get(){ return this.value == null ? "" : this.value },
      set(val){ this.$emit('input', val) }
    },
    optionsArr() {
      this.groupWatch = [...this.group];
      let temp = this.options;
      if(this.index === 0) return temp;
      if(this.group[this.index - 1]) {
        for(let i = 0; i < this.index; i++) {
          temp = temp.find(option => option[this.valueBy] === this.group[i])[this.childrenBy];
        }
        return temp;
      }
      return {};
    }
  },
  watch: {
    groupWatch(newVal, oldVal) {
      let target;
      for(let i = 0; i < this.group.length; i++) {
        if(newVal[i] !== oldVal[i]) target = i;
      }
      if(this.index > target) this.$emit('input', "");
    }
  },
  mounted() {
  },
  methods: {
    onChange() {
      this.$parent.$emit('validate'); // 通知FormItem校驗
      this.$emit('change', this.$refs.select.value);
    },
  }
})

// ud-select-date：日期連動下拉框
Vue.component('ud-select-date', {
  name: "UdSelectDate",
  template: `
    <div class="ud-select-date" :class="{'is-flex': flex}">
      <ud-select v-model="modelValue[0]" v-bind="$attrs" :options="firstArr" :placeholder="placeholder[0]" combine></ud-select>
      <slot></slot>
      <ud-select v-model="modelValue[1]" v-bind="$attrs" :options="secondArr" :placeholder="placeholder[1]" combine></ud-select>
      <slot name="second"></slot>
      <ud-select v-model="modelValue[2]" v-bind="$attrs" :options="thirdArr" :placeholder="placeholder[2]" combine v-if="third"></ud-select>
      <slot name="third"></slot>
    </div>
  `,
  inheritAttrs: false,
  props: {
    value: null, // value值
    placeholder: { // placeholder值 [Array]
      default: () => {
        return ["年", "月", "日"];
      }
    },
    third: Boolean, // 是否有第三項
    flex: Boolean, // 是否並排
    roc: Boolean // 是否為民國年
  },
  computed: {
    modelValue: {
      get(){ return this.value },
      set(val){ this.$emit('input', val) }
    },
    firstValue() {
      return this.modelValue[0];
    },
    secondValue() {
      return this.modelValue[1];
    },
    thirdValue() {
      return this.modelValue[2];
    },
    firstArr() {
      let temp = [];
      let time = new Date();
      let year = time.getFullYear();
      if(this.roc) year = year - 1911;
      let yearAfter = year - 120;
      if(this.roc && yearAfter <= 0) yearAfter = 1;
      for(let i = year; i >= yearAfter; i--){
        temp.push({value: i});
      }
      return temp;
    },
    secondArr() {
      let temp = [];
      if(this.firstValue){
        for(let i = 1; i <= 12; i++){
          temp.push({value: i});
        }
      }
      return temp;
    },
    thirdArr() {
      let temp = [];
      if(this.firstValue && this.secondValue){
        let year = parseInt(this.firstValue);
        if(this.roc) year = year + 1911;
        let date = new Date(year, this.secondValue, 0).getDate();
        for(let i = 1; i <= date; i++){
          temp.push({value: i});
        }
      }
      return temp;
    },
  },
  watch: {
    firstValue() {
      this.modelValue.splice(1, 1, "");
    },
    secondValue() {
      if(this.third) this.modelValue.splice(2, 1, "");
    },
  },
  mounted() {
    this.$on('validate', () => {
      this.$nextTick(() => {
        this.$parent.$emit('validate'); // 通知FormItem校驗
      })
    })
  }
})

// ud-select-twzip：台灣行政區連動下拉框
Vue.component('ud-select-twzip', {
  name: "UdSelectTwzip",
  template: `
    <div class="ud-select-twzip" :class="{'is-flex': flex}">
      <ud-select v-model="county" id="county" @change="onCountyChange()" :options="countyArr" :placeholder="placeholder[0]" :combine="combine"></ud-select>
      <slot></slot>
      <ud-select v-model="district" id="district" :options="districtArr" :placeholder="placeholder[1]" :combine="combine"></ud-select>
      <slot name="second"></slot>
    </div>
  `,
  props: {
    value: { // value值
      type: Array,
      default: () => ["", ""]
    }, 
    placeholder: { // placeholder值
      type: Array,
      default: () => ["請選擇縣市", "請選擇行政區"]
    },
    flex: Boolean, // 是否並排
    combine: Boolean, // 是否label直接使用value值
  },
  data() {
    return {
      county: "",
      district: "",
      options: [
        {
          label: "基隆市",
          value: "01",
          children: [
            { label: "仁愛區", value: "200" },
            { label: "信義區", value: "201" },
            { label: "中正區", value: "202" },
            { label: "中山區", value: "203" },
            { label: "安樂區", value: "204" },
            { label: "暖暖區", value: "205" },
            { label: "七堵區", value: "206" }
          ]
        },
        {
          label: "臺北市",
          value: "02",
          children: [
            { label: "中正區", value: "100" },
            { label: "大同區", value: "103" },
            { label: "中山區", value: "104" },
            { label: "松山區", value: "105" },
            { label: "大安區", value: "106" },
            { label: "萬華區", value: "108" },
            { label: "信義區", value: "110" },
            { label: "士林區", value: "111" },
            { label: "北投區", value: "112" },
            { label: "內湖區", value: "114" },
            { label: "南港區", value: "115" },
            { label: "文山區", value: "116" }
          ]
        },
        {
          label: "新北市",
          value: "03",
          children: [
            { label: "萬里區", value: "207" },
            { label: "金山區", value: "208" },
            { label: "板橋區", value: "220" },
            { label: "汐止區", value: "221" },
            { label: "深坑區", value: "222" },
            { label: "石碇區", value: "223" },
            { label: "瑞芳區", value: "224" },
            { label: "平溪區", value: "226" },
            { label: "雙溪區", value: "227" },
            { label: "貢寮區", value: "228" },
            { label: "新店區", value: "231" },
            { label: "坪林區", value: "232" },
            { label: "烏來區", value: "233" },
            { label: "永和區", value: "234" },
            { label: "中和區", value: "235" },
            { label: "土城區", value: "236" },
            { label: "三峽區", value: "237" },
            { label: "樹林區", value: "238" },
            { label: "鶯歌區", value: "239" },
            { label: "三重區", value: "241" },
            { label: "新莊區", value: "242" },
            { label: "泰山區", value: "243" },
            { label: "林口區", value: "244" },
            { label: "蘆洲區", value: "247" },
            { label: "五股區", value: "248" },
            { label: "八里區", value: "249" },
            { label: "淡水區", value: "251" },
            { label: "三芝區", value: "252" },
            { label: "石門區", value: "253" }
          ]
        },
        {
          label: "桃園市",
          value: "04",
          children: [
            { label: "中壢區", value: "320" },
            { label: "平鎮區", value: "324" },
            { label: "龍潭區", value: "325" },
            { label: "楊梅區", value: "326" },
            { label: "新屋區", value: "327" },
            { label: "觀音區", value: "328" },
            { label: "桃園區", value: "330" },
            { label: "龜山區", value: "333" },
            { label: "八德區", value: "334" },
            { label: "大溪區", value: "335" },
            { label: "復興區", value: "336" },
            { label: "大園區", value: "337" },
            { label: "蘆竹區", value: "338" }
          ]
        },
        {
          label: "新竹市",
          value: "05",
          children: [
            { label: "東區", value: "300" },
            { label: "北區", value: "300" },
            { label: "香山區", value: "300" }
          ]
        },
        {
          label: "新竹縣",
          value: "06",
          children: [
            { label: "竹北市", value: "302" },
            { label: "湖口鄉", value: "303" },
            { label: "新豐鄉", value: "304" },
            { label: "新埔鎮", value: "305" },
            { label: "關西鎮", value: "306" },
            { label: "芎林鄉", value: "307" },
            { label: "寶山鄉", value: "308" },
            { label: "竹東鎮", value: "310" },
            { label: "五峰鄉", value: "311" },
            { label: "橫山鄉", value: "312" },
            { label: "尖石鄉", value: "313" },
            { label: "北埔鄉", value: "314" },
            { label: "峨眉鄉", value: "315" }
          ]
        },
        {
          label: "苗栗縣",
          value: "07",
          children: [
            { label: "竹南鎮", value: "350" },
            { label: "頭份市", value: "351" },
            { label: "三灣鄉", value: "352" },
            { label: "南庄鄉", value: "353" },
            { label: "獅潭鄉", value: "354" },
            { label: "後龍鎮", value: "356" },
            { label: "通霄鎮", value: "357" },
            { label: "苑裡鎮", value: "358" },
            { label: "苗栗市", value: "360" },
            { label: "造橋鄉", value: "361" },
            { label: "頭屋鄉", value: "362" },
            { label: "公館鄉", value: "363" },
            { label: "大湖鄉", value: "364" },
            { label: "泰安鄉", value: "365" },
            { label: "銅鑼鄉", value: "366" },
            { label: "三義鄉", value: "367" },
            { label: "西湖鄉", value: "368" },
            { label: "卓蘭鎮", value: "369" }
          ]
        },
        {
          label: "臺中市",
          value: "08",
          children: [
            { label: "中區", value: "400" },
            { label: "東區", value: "401" },
            { label: "南區", value: "402" },
            { label: "西區", value: "403" },
            { label: "北區", value: "404" },
            { label: "北屯區", value: "406" },
            { label: "西屯區", value: "407" },
            { label: "南屯區", value: "408" },
            { label: "太平區", value: "411" },
            { label: "大里區", value: "412" },
            { label: "霧峰區", value: "413" },
            { label: "烏日區", value: "414" },
            { label: "豐原區", value: "420" },
            { label: "后里區", value: "421" },
            { label: "石岡區", value: "422" },
            { label: "東勢區", value: "423" },
            { label: "和平區", value: "424" },
            { label: "新社區", value: "426" },
            { label: "潭子區", value: "427" },
            { label: "大雅區", value: "428" },
            { label: "神岡區", value: "429" },
            { label: "大肚區", value: "432" },
            { label: "沙鹿區", value: "433" },
            { label: "龍井區", value: "434" },
            { label: "梧棲區", value: "435" },
            { label: "清水區", value: "436" },
            { label: "大甲區", value: "437" },
            { label: "外埔區", value: "438" },
            { label: "大安區", value: "439" }
          ]
        },
        {
          label: "彰化縣",
          value: "09",
          children: [
            { label: "彰化市", value: "500" },
            { label: "芬園鄉", value: "502" },
            { label: "花壇鄉", value: "503" },
            { label: "秀水鄉", value: "504" },
            { label: "鹿港鎮", value: "505" },
            { label: "福興鄉", value: "506" },
            { label: "線西鄉", value: "507" },
            { label: "和美鎮", value: "508" },
            { label: "伸港鄉", value: "509" },
            { label: "員林市", value: "510" },
            { label: "社頭鄉", value: "511" },
            { label: "永靖鄉", value: "512" },
            { label: "埔心鄉", value: "513" },
            { label: "溪湖鎮", value: "514" },
            { label: "大村鄉", value: "515" },
            { label: "埔鹽鄉", value: "516" },
            { label: "田中鎮", value: "520" },
            { label: "北斗鎮", value: "521" },
            { label: "田尾鄉", value: "522" },
            { label: "埤頭鄉", value: "523" },
            { label: "溪州鄉", value: "524" },
            { label: "竹塘鄉", value: "525" },
            { label: "二林鎮", value: "526" },
            { label: "大城鄉", value: "527" },
            { label: "芳苑鄉", value: "528" },
            { label: "二水鄉", value: "530" }
          ]
        },
        {
          label: "南投縣",
          value: "10",
          children: [
            { label: "南投市", value: "540" },
            { label: "中寮鄉", value: "541" },
            { label: "草屯鎮", value: "542" },
            { label: "國姓鄉", value: "544" },
            { label: "埔里鎮", value: "545" },
            { label: "仁愛鄉", value: "546" },
            { label: "名間鄉", value: "551" },
            { label: "集集鎮", value: "552" },
            { label: "水里鄉", value: "553" },
            { label: "魚池鄉", value: "555" },
            { label: "信義鄉", value: "556" },
            { label: "竹山鎮", value: "557" },
            { label: "鹿谷鄉", value: "558" }
          ]
        },
        {
          label: "雲林縣",
          value: "11",
          children: [
            { label: "斗南鎮", value: "630" },
            { label: "大埤鄉", value: "631" },
            { label: "虎尾鎮", value: "632" },
            { label: "土庫鎮", value: "633" },
            { label: "褒忠鄉", value: "634" },
            { label: "東勢鄉", value: "635" },
            { label: "臺西鄉", value: "636" },
            { label: "崙背鄉", value: "637" },
            { label: "麥寮鄉", value: "638" },
            { label: "斗六市", value: "640" },
            { label: "林內鄉", value: "643" },
            { label: "古坑鄉", value: "646" },
            { label: "莿桐鄉", value: "647" },
            { label: "西螺鎮", value: "648" },
            { label: "二崙鄉", value: "649" },
            { label: "北港鎮", value: "651" },
            { label: "水林鄉", value: "652" },
            { label: "口湖鄉", value: "653" },
            { label: "四湖鄉", value: "654" },
            { label: "元長鄉", value: "655" }
          ]
        },
        {
          label: "嘉義市",
          value: "12",
          children: [
            { label: "東區", value: "600" },
            { label: "西區", value: "600" }
          ]
        },
        {
          label: "嘉義縣",
          value: "13",
          children: [
            { label: "番路鄉", value: "602" },
            { label: "梅山鄉", value: "603" },
            { label: "竹崎鄉", value: "604" },
            { label: "阿里山鄉", value: "605" },
            { label: "中埔鄉", value: "606" },
            { label: "大埔鄉", value: "607" },
            { label: "水上鄉", value: "608" },
            { label: "鹿草鄉", value: "611" },
            { label: "太保市", value: "612" },
            { label: "朴子市", value: "613" },
            { label: "東石鄉", value: "614" },
            { label: "六腳鄉", value: "615" },
            { label: "新港鄉", value: "616" },
            { label: "民雄鄉", value: "621" },
            { label: "大林鎮", value: "622" },
            { label: "溪口鄉", value: "623" },
            { label: "義竹鄉", value: "624" },
            { label: "布袋鎮", value: "625" }
          ]
        },
        {
          label: "臺南市",
          value: "14",
          children: [
            { label: "中西區", value: "700" },
            { label: "東區", value: "701" },
            { label: "南區", value: "702" },
            { label: "北區", value: "704" },
            { label: "安平區", value: "708" },
            { label: "安南區", value: "709" },
            { label: "永康區", value: "710" },
            { label: "歸仁區", value: "711" },
            { label: "新化區", value: "712" },
            { label: "左鎮區", value: "713" },
            { label: "玉井區", value: "714" },
            { label: "楠西區", value: "715" },
            { label: "南化區", value: "716" },
            { label: "仁德區", value: "717" },
            { label: "關廟區", value: "718" },
            { label: "龍崎區", value: "719" },
            { label: "官田區", value: "720" },
            { label: "麻豆區", value: "721" },
            { label: "佳里區", value: "722" },
            { label: "西港區", value: "723" },
            { label: "七股區", value: "724" },
            { label: "將軍區", value: "725" },
            { label: "學甲區", value: "726" },
            { label: "北門區", value: "727" },
            { label: "新營區", value: "730" },
            { label: "後壁區", value: "731" },
            { label: "白河區", value: "732" },
            { label: "東山區", value: "733" },
            { label: "六甲區", value: "734" },
            { label: "下營區", value: "735" },
            { label: "柳營區", value: "736" },
            { label: "鹽水區", value: "737" },
            { label: "善化區", value: "741" },
            { label: "大內區", value: "742" },
            { label: "山上區", value: "743" },
            { label: "新市區", value: "744" },
            { label: "安定區", value: "745" }
          ]
        },
        {
          label: "高雄市",
          value: "15",
          children: [
            { label: "新興區", value: "800" },
            { label: "前金區", value: "801" },
            { label: "苓雅區", value: "802" },
            { label: "鹽埕區", value: "803" },
            { label: "鼓山區", value: "804" },
            { label: "旗津區", value: "805" },
            { label: "前鎮區", value: "806" },
            { label: "三民區", value: "807" },
            { label: "楠梓區", value: "811" },
            { label: "小港區", value: "812" },
            { label: "左營區", value: "813" },
            { label: "仁武區", value: "814" },
            { label: "大社區", value: "815" },
            { label: "岡山區", value: "820" },
            { label: "路竹區", value: "821" },
            { label: "阿蓮區", value: "822" },
            { label: "田寮區", value: "823" },
            { label: "燕巢區", value: "824" },
            { label: "橋頭區", value: "825" },
            { label: "梓官區", value: "826" },
            { label: "彌陀區", value: "827" },
            { label: "永安區", value: "828" },
            { label: "湖內區", value: "829" },
            { label: "鳳山區", value: "830" },
            { label: "大寮區", value: "831" },
            { label: "林園區", value: "832" },
            { label: "鳥松區", value: "833" },
            { label: "大樹區", value: "840" },
            { label: "旗山區", value: "842" },
            { label: "美濃區", value: "843" },
            { label: "六龜區", value: "844" },
            { label: "內門區", value: "845" },
            { label: "杉林區", value: "846" },
            { label: "甲仙區", value: "847" },
            { label: "桃源區", value: "848" },
            { label: "那瑪夏區", value: "849" },
            { label: "茂林區", value: "851" },
            { label: "茄萣區", value: "852" }
          ]
        },
        {
          label: "屏東縣",
          value: "16",
          children: [
            { label: "屏東市", value: "900" },
            { label: "三地門鄉", value: "901" },
            { label: "霧臺鄉", value: "902" },
            { label: "瑪家鄉", value: "903" },
            { label: "九如鄉", value: "904" },
            { label: "里港鄉", value: "905" },
            { label: "高樹鄉", value: "906" },
            { label: "鹽埔鄉", value: "907" },
            { label: "長治鄉", value: "908" },
            { label: "麟洛鄉", value: "909" },
            { label: "竹田鄉", value: "911" },
            { label: "內埔鄉", value: "912" },
            { label: "萬丹鄉", value: "913" },
            { label: "潮州鎮", value: "920" },
            { label: "泰武鄉", value: "921" },
            { label: "來義鄉", value: "922" },
            { label: "萬巒鄉", value: "923" },
            { label: "崁頂鄉", value: "924" },
            { label: "新埤鄉", value: "925" },
            { label: "南州鄉", value: "926" },
            { label: "林邊鄉", value: "927" },
            { label: "東港鎮", value: "928" },
            { label: "琉球鄉", value: "929" },
            { label: "佳冬鄉", value: "931" },
            { label: "新園鄉", value: "932" },
            { label: "枋寮鄉", value: "940" },
            { label: "枋山鄉", value: "941" },
            { label: "春日鄉", value: "942" },
            { label: "獅子鄉", value: "943" },
            { label: "車城鄉", value: "944" },
            { label: "牡丹鄉", value: "945" },
            { label: "恆春鎮", value: "946" },
            { label: "滿州鄉", value: "947" }
          ]
        },
        {
          label: "臺東縣",
          value: "17",
          children: [
            { label: "臺東市", value: "950" },
            { label: "綠島鄉", value: "951" },
            { label: "蘭嶼鄉", value: "952" },
            { label: "延平鄉", value: "953" },
            { label: "卑南鄉", value: "954" },
            { label: "鹿野鄉", value: "955" },
            { label: "關山鎮", value: "956" },
            { label: "海端鄉", value: "957" },
            { label: "池上鄉", value: "958" },
            { label: "東河鄉", value: "959" },
            { label: "成功鎮", value: "961" },
            { label: "長濱鄉", value: "962" },
            { label: "太麻里鄉", value: "963" },
            { label: "金峰鄉", value: "964" },
            { label: "大武鄉", value: "965" },
            { label: "達仁鄉", value: "966" }
          ]
        },
        {
          label: "花蓮縣",
          value: "18",
          children: [
            { label: "花蓮市", value: "970" },
            { label: "新城鄉", value: "971" },
            { label: "秀林鄉", value: "972" },
            { label: "吉安鄉", value: "973" },
            { label: "壽豐鄉", value: "974" },
            { label: "鳳林鎮", value: "975" },
            { label: "光復鄉", value: "976" },
            { label: "豐濱鄉", value: "977" },
            { label: "瑞穗鄉", value: "978" },
            { label: "萬榮鄉", value: "979" },
            { label: "玉里鎮", value: "981" },
            { label: "卓溪鄉", value: "982" },
            { label: "富里鄉", value: "983" }
          ]
        },
        {
          label: "宜蘭縣",
          value: "19",
          children: [
            { label: "宜蘭市", value: "260" },
            { label: "頭城鎮", value: "261" },
            { label: "礁溪鄉", value: "262" },
            { label: "壯圍鄉", value: "263" },
            { label: "員山鄉", value: "264" },
            { label: "羅東鎮", value: "265" },
            { label: "三星鄉", value: "266" },
            { label: "大同鄉", value: "267" },
            { label: "五結鄉", value: "268" },
            { label: "冬山鄉", value: "269" },
            { label: "蘇澳鎮", value: "270" },
            { label: "南澳鄉", value: "272" }
          ]
        },
        {
          label: "澎湖縣",
          value: "20",
          children: [
            { label: "馬公市", value: "880" },
            { label: "西嶼鄉", value: "881" },
            { label: "望安鄉", value: "882" },
            { label: "七美鄉", value: "883" },
            { label: "白沙鄉", value: "884" },
            { label: "湖西鄉", value: "885" }
          ]
        },
        {
          label: "金門縣",
          value: "21",
          children: [
            { label: "金沙鎮", value: "890" },
            { label: "金湖鎮", value: "891" },
            { label: "金寧鄉", value: "892" },
            { label: "金城鎮", value: "893" },
            { label: "烈嶼鄉", value: "894" },
            { label: "烏坵鄉", value: "896" }
          ]
        },
        {
          label: "連江縣",
          value: "22",
          children: [
            { label: "南竿鄉", value: "209" },
            { label: "北竿鄉", value: "210" },
            { label: "莒光鄉", value: "211" },
            { label: "東引鄉", value: "212" }
          ]
        }
      ]
    }
  },
  computed: {
    countyArr() {
      return this.options;
    },
    districtArr() {
      let temp = [];
      if(this.county){
        temp = this.options.find(option => option.value === this.county).children;
      }
      return temp;
    },
  },
  watch: {
    value: {
      immediate: true,
      handler(){
        this.county = this.value[0];
        if(this.county === "05") {
          this.district = "300";
        }else if(this.county === "12") {
          this.district = "600";
        }else {
          this.district = this.value[1];
        }
      }
    },
    county() {
      this.$emit("input", [this.county, this.district]);
    },
    district() {
      this.$emit("input", [this.county, this.district]);
    },
  },
  mounted() {
    this.$on('validate', () => {
      this.$nextTick(() => {
        this.$parent.$emit('validate'); // 通知FormItem校驗
      })
    })
  },
  methods: {
    onCountyChange() {
      this.district = "";
    }
  },
})

// ud-switch：開關
Vue.component('ud-switch', {
  name: "UdSwitch",
  template: `
    <div class="ud-switch">
      <label>
        <input 
          type="checkbox"
          v-model="modelValue"
          v-bind="$attrs"
          @change="onChange"
        >
        <div class="switch-decorator">
          <div class="circle"></div>
        </div>
        <slot></slot>
      </label>
    </div>
  `,
  inheritAttrs: false,
  props: {
    value: { default: false }, // value值
  },
  computed: {
    modelValue: {
      get(){ return this.value },
      set(val){ this.$emit('input', val) }
    }
  },
  methods: {
    onChange() {
      this.$nextTick(() => {
        this.$emit("change", this.modelValue)
      });
    }
  },
})

// ud-form-item：表單驗證容器
Vue.component('ud-form-item', {
  name: "UdFormItem",
  template: `
    <div class="ud-form-item" :class="{'is-error': errorMessage, 'is-flex': flex}">
      <div class="ud-form-item-left" :v-if="label" :style="{ 'flex-basis': labelWidth }" 
        :class="{ 'label-align-left': labelAlign === 'left', 'label-align-center': labelAlign === 'center', 'label-align-right': labelAlign === 'right' }"
      >
        <img :src="icon" v-if="icon">
        <label v-if="label"><span v-if="required">*</span>{{ label }}</label>
      </div>
      <div class="ud-form-item-right">  
        <slot></slot>
        <p class="error-message" v-if="errorMessage">{{ errorMessage }}</p>
      </div>
    </div>
  `,
  data() {
    return {
      errorMessage: '',
      lock: false,
    }
  },
  inject: ["form"],
  props: {
    required: { // 必填提示
      type: Boolean,
    },
    icon: { // icon路徑
      type: String
    },
    label: { // 標籤內容
      type: String,
    },
    prop: { // 驗證名稱
      type: String
    },
    flex: { // 是否並排
      type: Boolean
    },
    labelWidth: { // 標籤寬度
      type: String,
      default: "30%",
    },
    labelAlign: { // 標籤對齊
      type: String,
      default: 'left',
    },
  },
  mounted() {
    this.$on('validate', () => {
      if (!this.prop) return;
      this.validate(false);
    })
  },
  methods: {
    validate(submit) {
      if (this.form.submitLock) return;
      const rules = this.form.rules[this.prop]; // 獲取校驗規則
      const value = this.form.model[this.prop]; // 獲取數據
      
      if (!rules) return;
      this.errorMessage = "";
      for(let rule of rules){
        switch (rule.type) {
          case "required": // 必填驗證
            if(Array.isArray(value) && value.length != 0){
              if(value.some(i => i.length === 0)) this.errorMessage = rule.message || "此欄位為必填項目";
            }else if(value === null){
              this.errorMessage = rule.message || "此欄位為必填項目";
            }else{
              if(value.length === 0 || value === false) this.errorMessage = rule.message || "此欄位為必填項目";
            }
            break;
          case "name": // 姓名驗證
            if(value && !/^[\p{sc=Han}a-zA-Z·\s]+$/u.test(value)) this.errorMessage = rule.message || "姓名格式有誤，不接受特殊符號";
            break;
          case "phone": // 電話驗證
            let valueAfter = this.typeOf(value) === 'array' ? value.join("") : value;
            if(valueAfter && !/^09[0-9]{8}$/.test(valueAfter)) this.errorMessage = rule.message || "電話格式有誤，例: 0929123456";
            break;
          case "email": // 電子郵件驗證
            if(value && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) this.errorMessage = rule.message || "Email格式有誤，需包含'@'符號";
            break;
          case "uniform": // 統一編號驗證
            if(value && !/^[0-9]{8}$/.test(value)) this.errorMessage = rule.message || "統一編號格式有誤，例: 12345678";
            break;
          case "idcard": // 身分證字號驗證
            if(value && !/^[A-Z](1|2)[0-9]{8}$/.test(value)) this.errorMessage = rule.message || "身分證字號格式有誤，例: A123456789";
            break;
          case "date": // 日期驗證
            if(value && !/^(?:(?!0000)[0-9]{4}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29)$/.test(value)) this.errorMessage = rule.message || "日期格式有誤或不存在，例: 2020-03-04";
            break;
          case "number": // 數字驗證
            if(value && !/^[0-9]+$/.test(value)) this.errorMessage = rule.message || "格式有誤，只接受數字";
            break;
          case "url": // 網址驗證
            if(value && !/^https?:\/\/([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}([/?#][^\s]*)?$/i.test(value)) this.errorMessage = rule.message || "網址格式有誤，例: https://www.google.com";
            break;
          case "ip": // IP地址驗證
            if(value && !/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(value)) this.errorMessage = rule.message || "IP地址格式有誤，例: 115.28.47.26";
            break;
          case "hex": // Hex色碼驗證
            if(value && !/^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/.test(value)) this.errorMessage = rule.message || "Hex色碼格式有誤，例: #ff0000";
            break;
          case "equal": // 相等驗證
            if(rule.caseIgnore){ // 不區分大小寫
              if(value && value.toLowerCase() !== this.form.model[rule.equalTo].toLowerCase()) this.errorMessage = rule.message || "驗證碼錯誤";
            }else{ // 區分大小寫
              if(value && value !== this.form.model[rule.equalTo]) this.errorMessage = rule.message || "驗證碼錯誤";
            }
            break;
          case "schema": // 自定義驗證條件(將rules寫成computed回傳動態驗證函式)
            if (!rule.schema) this.errorMessage = rule.message || "驗證條件不符合";
            break;
          case "regex": // 自訂正則驗證
            if(!new RegExp(rule.regex).test(value)) this.errorMessage = rule.message || "格式有誤，請重新輸入";
            break;
          default:
            console.error("預期外的驗證類型: " + rule.type);
            break;
        }
        if (this.errorMessage) break;
      }

      if (!submit) return;
      return new Promise((resolve, reject) => {
        this.errorMessage ? reject() : resolve();
      });
    },
    clearValidate() {
      this.errorMessage = '';
    },
    typeOf(val) {
      return val === undefined ? 'undefined' : val === null ? 'null' : val.constructor.name.toLowerCase();
    },
  }
})

// ud-form：表單驗證
Vue.component('ud-form', {
  name: "UdForm",
  template: `
    <div class="ud-form" :class="{'is-no-error-msg': noErrorMsg}">
      <slot></slot>
    </div>
  `,
  inheritAttrs: false,
  provide() {
    return {
      form: this  // 傳遞Form實例给後代，比如FormItem用來校驗
    }
  },
  data() {
    return {
      submitLock: true
    }
  },
  props: {
    model: { // 驗證資料
      type: Object,
      required: true
    },
    rules: { // 驗證規則
      type: Object
    },
    noErrorMsg: { // 有無錯誤提示
      type: Boolean
    },
    noErrorScroll: { // 驗證時不滾動至錯誤項目
      type: Boolean
    },
  },
  methods: {
    validate(successCb = () => {console.log('驗證成功')}, failedCb = () => {console.log('驗證失敗')}) {
      this.submitLock = false;
      const tasks = this.$children.filter(item => item.prop).map(item => item.validate(true));
      // console.log('tasks: ', tasks);
      Promise.all(tasks)
        .then(() => successCb())
        .catch(() => {
          if (!this.noErrorScroll) {
            this.$nextTick(() => {
              const el = document.querySelector(".is-error");
              if (el) {
                this.scrollTo(el, 5, -10);
              }
            });
          }
          failedCb();
        })
    },
    clearValidate() {
      this.$children.forEach(item => {
        if (typeof item.clearValidate === 'function') {
          item.clearValidate();
        }
      });
    },
    scrollTo(el = "top", speed = 5, offset = 0, callback = () => {}) {
      let scrollTop = document.scrollingElement.scrollTop;
      let top = 0;

      if (typeof el === 'number') {
        top = el + offset;
      } else if (typeof el === 'string') {
        if (el === 'top') {
          top = 0 + offset;
        } else if (el === 'bottom') {
          top = document.body.scrollHeight - document.body.clientHeight + offset;
        } else {
          const found = document.querySelector(el);
          if (found) {
            top = found.offsetTop + offset;
          }
        }
      } else if (el instanceof HTMLElement) {
        top = el.offsetTop + offset;
      }
      const scroll = () => {
        scrollTop = scrollTop + (top - scrollTop) / speed;
        if (Math.abs(scrollTop - top) <= 1) {
          document.scrollingElement.scrollTop = top;
          callback && callback();
          return;
        }
        document.scrollingElement.scrollTop = scrollTop;
        requestAnimationFrame(scroll);
      };
      scroll();
    },
  }
})

//-----------------------Layout-----------------------
// ud-arrow：CSS箭頭
Vue.component('ud-arrow', {
  name: "UdArrow",
  template: `
    <i 
      class="ud-arrow"
      :class=[direction]
      :style="{
        'border-color': color,
        'border-width': '0 ' + width + 'px ' + width + 'px 0',
        padding: size + 'px'
      }">
    </i>
  `,
  props: {
    color: { default: "#333" }, // 顏色
    width: { default: "3" }, // 寬度
    size: { default: "3" }, // 大小
    direction: { default: "right" } //方向
  }
})

// ud-collapse：摺疊容器
Vue.component('ud-collapse', {
  name: "UdCollapse",
  template: `
    <div class="ud-collapse" :style="{'transition-duration': durationSecond}">
      <div class="ud-collapse-wrapper">
        <slot></slot>
      </div>
    </div>
  `,
  props: {
    value: {
      default: false
    },
    duration: { default: 0.2 } // 開闔速度
  },
  computed: {
    durationSecond() {
      return `${this.duration}s`
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(){
        this.$nextTick(() => {
          this.collapse();
        })
      }
    }
  },
  methods: {
    collapse() {
      let el = this.$el;
      if (this.value) {
        el.style.height = el.querySelector('.ud-collapse-wrapper').clientHeight + "px";
      } else {
        el.style.height = 0;
      }
    }
  }
})

// ud-image：等比例自適應圖片
Vue.component('ud-image', {
  name: "UdImage",
  template: `
    <div class="ud-image">
      <div class="ud-image-bg" :style="{
        backgroundImage: 'url(' + src + ')', 
        paddingBottom: height + '%', 
        borderRadius: radius,
        backgroundSize: bgSize
      }">
        <slot></slot>
      </div>
    </div>
  `,
  props: {
    src: { default: "https://i.imgur.com/s3w1Sm3.jpg" }, // 背景圖片
    height: { default: 100 }, // 高度比例
    radius: { default: '0px' }, // 圓角
    bgSize: { default: "cover" } // 背景尺寸 (cover, contain, 100%...等)
  }
})


//-----------------------Notice-----------------------
// ud-alert：警告彈窗
const UdAlert = {
  name: "UdAlert",
  template: `
    <transition name="fade">
      <div class="ud-alert" v-if="isShow" @click.self="maskHandler">
        <div class="ud-modal-wrapper">
          <div class="ud-modal-close" v-if="btnClose" @click="destroy">
            <i class="icon-close"></i>
          </div>
          <div class="ud-modal-header" v-if="title">
            <p v-html="nl2br(title)"></p>
          </div>
          <div class="ud-modal-body">
            <p v-html="nl2br(message)"></p>
          </div>
          <div class="ud-modal-footer">
            <ud-button @click="cancelHandler" plain v-if="confirm">{{ cancelText }}</ud-button>
            <ud-button @click="confirmHandler">{{ confirmText }}</ud-button>
          </div>
        </div>
      </div>
    </transition>
  `,
  data() {
    return {
      isShow: false, // 是否顯示
      confirm: false, // 是否有確認+取消鈕
      maskClose: false, // 點擊遮罩關閉
      btnClose: false, // 右上關閉按鈕
      scrollLock: true, // 是否鎖定背景頁面捲動
      title: "", // 標題文字
      message: "", // 訊息文字(msg也可以，接受html語法)
      cancelText: "取消", // 取消鈕文字
      onCancel: () => {}, // 取消鈕callback
      confirmText: "確定", // 確認鈕文字
      onConfirm: () => {}, // 確認鈕callback
      resolve: "", // 保存resolve
      reject: "", // 保存reject
    }
  },
  mounted() {
    if(this.scrollLock) document.getElementsByTagName('body')[0].style.overflow = 'hidden';
    if(this.scrollLock) document.getElementsByTagName('body')[0].style.overflowY = 'hidden';
    if(this.message === "") this.message = this.msg;
  },
  methods: {
    show() {
      this.isShow = true;
      return new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      })
    },
    nl2br(val) {
      return nl2br(val);
    },
    confirmHandler() {
      this.onConfirm();
      this.resolve('confirm');
      this.destroy();
    },
    cancelHandler() {
      this.onCancel();
      this.reject('cancel');
      this.destroy();
    },
    maskHandler() {
      if(this.maskClose) this.destroy();
    },
    destroy() {
      this.isShow = false;
      if(this.scrollLock) document.getElementsByTagName('body')[0].style.overflow = 'auto'
      setTimeout(() => {
        this.$destroy(true);
        this.$el.parentNode.removeChild(this.$el);
      }, 200);
    },
  }
};

const udAlertExtend = Vue.extend(UdAlert);
const udAlert = options => {
  let instance = new udAlertExtend();
  typeof options === 'string' || typeof options === 'number' ? instance.message = options : Object.assign(instance, options);
  document.body.appendChild(instance.$mount().$el);
  return instance.show();
};
Vue.prototype.udAlert = udAlert;

// ud-modal：通用彈窗
Vue.component("ud-modal", {
  name: "UdModal",
  template: `
    <transition name="fade">
      <div class="ud-modal" v-if="isShow" @click.self="maskHandler" :class="{ 'full-screen': fullScreen }" :style="{ zIndex: zIndex }">
        <div class="ud-modal-wrapper" :class="{ 'no-bg': noBg }">
          <div class="ud-modal-close" v-if="btnClose" @click="isShow = 0">
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
              <ud-button @click="isShow = 0">確認</ud-button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  `,
  props: {
    title: { default: "通用標題" }, // 通用標題
    message: { default: "通用訊息" }, // 通用訊息
    value: { default: 0 }, // 開關值
    maskClose: Boolean, // 點擊遮罩關閉
    btnClose: Boolean, // 右上關閉按鈕
    fullScreen: Boolean, // 是否全螢幕
    zIndex: { default: 100 }, // z-index層級
    noBg: Boolean // 背景是否透明
  },
  computed: {
    isShow: {
      get(){ return this.value },
      set(val){ this.$emit('input', val) }
    }
  },
  methods: {
    maskHandler() {
      if(this.maskClose) this.isShow = 0;
    },
  }
});

// ud-loading：載入中
const UdLoading = {
  name: "UdLoading",
  template: `
    <transition name="loading">
      <div class="ud-loading" v-show="isShow" :class="{'theme-white': theme === 'white'}">
        <div class="ud-modal-wrapper">
          <div class="ud-modal-content">
            <div class="ud-modal-header">
              <div v-if="iconType === 'css'" class="icon-css"></div>
              <i v-else-if="iconType === 'font'" class="icon-font" :class="iconFont"></i>
              <img v-else class="icon-img" :src="iconImg">
            </div>
            <div class="ud-modal-body">
              <p v-html="nl2br(message)"></p>
            </div>
          </div>
        </div>
      </div>
    </transition>
  `,
  data() {
    return {
      isShow: false,
      fixed: false, // 是否固定body
      theme: "", // 戴入主題 [white]
      iconType: "css", // icon類型 [css:CSS, font:字型, img:圖片]
      iconFont: "fas fa-spinner fa-pulse", // 字型icon的class
      iconImg: "https://image.flaticon.com/icons/svg/553/553265.svg", // 圖片icon的路徑
      message: "", // 載入訊息
    }
  },
  mounted() {
    this.isShow = true;
  },
  methods: {
    nl2br(val) {
      return nl2br(val);
    },
    destroy() {
      this.isShow = false;
      document.body.style.overflowY = 'auto';
      setTimeout(() => {
        this.$destroy(true);
        this.$el.parentNode.removeChild(this.$el);
      }, 200);
    },
  }
};

const udLoadingExtend = Vue.extend(UdLoading);
const udLoading = {
  instance: null,
  open: (options = {}) => {
    udLoading.instance = new udLoadingExtend({
      el: document.createElement("div"),
      data() { return options }
    })
    if(udLoading.instance.fixed) document.body.style.overflowY = 'hidden';
    document.body.appendChild(udLoading.instance.$el);
  },
  close: () => udLoading.instance.destroy()
};
Vue.prototype.udLoading = udLoading;

//-----------------------Tools-----------------------
// ud-html：自定義訊息
Vue.component('ud-html', {
  name: "UdHtml",
  template: `
    <div class="ud-html" v-html="nl2br(text)"></div>
  `,
  props: {
    text: { default: "<h1>H1 用戶自定義訊息</h1><h2>H2 用戶自定義訊息</h2><h3>H3 用戶自定義訊息</h3><h4>H4 用戶自定義訊息</h4><h5>H5 用戶自定義訊息</h5><h6>H6 用戶自定義訊息</h6>\n<p>p 用戶自定義訊息</p><span>span 用戶自定義訊息</span>" } // 文字
  },
  methods: {
    nl2br(str, is_xhtml) {
      if (typeof str === 'undefined' || str === null) {
          return '';
      }
      let breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
      return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
    }
  }
})

// ud-ellipsis：文字省略
Vue.component('ud-ellipsis', {
  name: "UdEllipsis",
  template: `
    <p class="ud-ellipsis" :style="{webkitLineClamp: maxLine}">
      <slot></slot>
    </p>
  `,
  props: {
    maxLine: { default: 1, } // 指定省略行數
  }
})

// ud-countdown：倒數計時
Vue.component('ud-countdown', {
  name: "UdCountdown",
  template: `
    <span class="ud-countdown" ref="count">{{formatCountTime}}</span>
  `,
  props: {
    time: { default: 60 }, // 倒數秒數
    delay: Boolean, // 是否不要立刻開始倒數
    type: { default: "second" } // 時間格式
  },
  data() {
    return {
      countInterval: {},
      countTime: this.time
    }
  },
  computed: {
    formatCountTime() {
      if(this.type === "second") {
        return this.countTime
      }else if(this.type === "minute"){
        let min = Math.floor(this.countTime / 60);
        let sec = this.countTime - (min * 60);
        return `${min}:${this.padStart(sec)}`;
      }
    }
  },
  mounted() {
    if(!this.delay) this.countdown();
  },
  methods: {
    countdown(){
      if(this.countInterval) clearInterval(this.countInterval);
      this.countInterval = setInterval(() => {
        this.countTime -= 1;
        if (this.countTime <= 0) {
          this.$emit("timeup");
          clearInterval(this.countInterval);
          this.countInterval = null;
        }
      }, 1000);
    },
    reset(){
      if(this.countInterval) clearInterval(this.countInterval);
      this.countTime = this.time;
      this.countdown();
    },
    padStart(val, length = 2, fillChar = '0') {
      if (val == null) return '';
      return val.toString().padStart(length, fillChar.toString());
    },
  }
})

//-----------------------String-----------------------
/**
 * 將字串內換行符\n轉為<br>
 * @param {string} val 傳入值
 * @param {boolean} is_xhtml 是否為xhtml 預設為false
 * @example nl2br("Line1\nLine2") -> "Line1<br>Line2"
 */
const nl2br = (val = '', isXhtml = false) => {
  if (typeof val !== 'string') return val;
  const breakTag = isXhtml ? '<br />' : '<br>';
  return val.replace(/(\r\n|\n\r|\r|\n)/g, breakTag);
};

/**
 * 取得隨機字串
 * @param {number} length 指定字串長度 預設為10
 */
const getRandomString = (length = 10) => {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charsetLength = charset.length;
  let result = '';
  for (let i = 0; i < length; i++) {
    result += charset[Math.floor(Math.random() * charsetLength)];
  }
  return result;
};

/**
 * 複製文字至剪貼簿
 * @param {string} text 要複製的文字
 * @example copyText("要複製的文字").then(res => udAlert(`已複製\n${ res }`));
 */
const copyText = (text = "") => {
  return new Promise((resolve, reject) => {
    if (!text) return reject(new Error("未提供文字"));
    // 現代瀏覽器支援 Clipboard API
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text)
        .then(() => resolve(text))
        .catch(err => {
          console.error("Clipboard API 複製失敗:", err);
          fallbackCopy();
        });
    } else {
      fallbackCopy();
    }
    // 備援方案
    function fallbackCopy() {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      textarea.setAttribute('readonly', 'true');
      document.body.appendChild(textarea);
      textarea.select();
      try {
        const successful = document.execCommand('copy');
        if (successful) {
          resolve(text);
        } else {
          throw new Error("execCommand 失敗");
        }
      } catch (err) {
        console.error("備援複製失敗:", err);
        reject(err);
      } finally {
        document.body.removeChild(textarea);
      }
    }
  });
};

//-----------------------Number-----------------------
/**
 * 取得範圍內隨機整數
 * @param {number} min 隨機數最小值 預設為0
 * @param {number} max 隨機數最大值 預設為100
 * @example getRandom(5, 10) -> 7
 */
const getRandom = (min = 0, max = 100) => {
  min = Math.ceil(Number(min));
  max = Math.floor(Number(max));
  if (isNaN(min) || isNaN(max) || min > max) return NaN;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * 數字加入千分位逗號
 * @param {number} val 傳入值
 * @example formatNumber(99999) -> 99,999
 */
const formatNumber = (val) => {
  if (val == null || isNaN(val)) return '';
  return Number(val).toLocaleString();
};

/**
 * 數字補零
 * @param {number|string} val 傳入值
 * @param {number} length 要補到幾位 預設為2
 * @param {number|string} fillChar 要補的值，預設為 '0'
 * @example padStart(5) -> '05'
 * @example padStart(5, 4) -> '0005'
 * @example padStart(5, 4, 2) -> '2225'
 */
const padStart = (val, length = 2, fillChar = '0') => {
  if (val == null) return '';
  return val.toString().padStart(length, fillChar.toString());
};

//-----------------------Image-----------------------
/**
 * 單張圖片載入完成
 * @param {string} url 圖片路徑
 * @example imageLoaded('imgUrl').then(...) -> 圖片讀取完成時返回該Image物件
 */
const imageLoaded = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`圖片載入失敗：${url}`));
    img.src = url;
    if (img.complete) {
      resolve(img);
    }
  });
};

/**
 * 多張圖片載入完成
 * @param {array} urls 多張圖片路徑陣列
 * @example imageAllLoaded(['imgUrl1','imgUrl2']).then(...) -> 全部圖片都讀取完成時返回該Image物件組成的陣列
 */
const imageAllLoaded = (urls = []) => {
  const loadImage = (src) => new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(new Error(`圖片載入失敗：${src}`));
    img.src = src;
  });
  return Promise.all(urls.map(loadImage));
};

/**
 * 下載Img圖片
 * @param {string} selector 圖片元素的選擇器
 * @param {string} name 圖片名稱（預設為 "下載圖片"）
 * @param {string} type 圖片格式（預設為 'image/jpeg'，可為 'image/png' 等）
 * @example imageDownload('#image', '自訂圖片名稱', 'image/png')
 */
const imageDownload = (selector, name = '下載圖片', type = 'image/jpeg') => {
  const imgElement = document.querySelector(selector);
  if (!imgElement || !imgElement.src) {
    console.warn('無效的圖片元素或未設定 src。');
    return;
  }
  const image = new Image();
  image.crossOrigin = 'anonymous'; // 避免跨域污染
  image.src = imgElement.src;
  image.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0);
    const url = canvas.toDataURL(type);
    const a = document.createElement('a');
    a.download = name;
    a.href = url;
    a.click(); // 觸發下載
  };
  image.onerror = () => {
    console.error('圖片載入失敗，可能因為跨域或圖片損毀。');
  };
};

//-----------------------Array-----------------------
/**
 * 陣列是否有重複值(不分型別)
 * @param {array} arr 傳入值
 * @example isArrayRepeat([1, 2, 2, 3]) -> true
 */
const isArrayRepeat = (arr) => {
  if (!Array.isArray(arr)) return false;
  return new Set(arr).size !== arr.length;
};

/**
 * 移除陣列中的重複元素
 * @param {array} arr 傳入值
 * @example removeArrayRepeat([1, 2, 2, 3]) -> [1, 2, 3]
 */
const removeArrayRepeat = (arr) => {
  if (!Array.isArray(arr)) return [];
  return [...new Set(arr)];
};

/**
 * 返回陣列中某值的所有索引
 * @param {array} arr 傳入值
 * @param {number} val 指定值
 * @example indexOfAll([1, 2, 3, 1, 2, 3], 1); -> [0,3]
 * @example indexOfAll([1, 2, 3], 4); -> []
 */
const indexOfAll = (arr, val) => {
  if (!Array.isArray(arr)) return [];
  const result = [];
  arr.forEach((el, i) => {
    if (el === val) result.push(i);
  });
  return result;
};

//-----------------------Object-----------------------
/**
 * 精準型別判斷
 * @param {any} val 傳入值
 * @example typeOf(true); -> boolean;
 * @example typeOf(123); -> number;
 * @example typeOf([1, 2, 3]); -> array;
 */
const typeOf = (val) => {
  return Object.prototype.toString.call(val).slice(8, -1).toLowerCase();
};

/**
 * 深拷貝
 * @param {object} obj 傳入值 要拷貝的資料
 * @param {WeakMap} hash 用於處理循環引用
 */
const deepClone = (obj, hash = new WeakMap()) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof RegExp) return new RegExp(obj);
  if (obj instanceof Error) {
    const err = new obj.constructor(obj.message);
    err.stack = obj.stack;
    return err;
  }
  if (hash.has(obj)) return hash.get(obj);
  const clone = Array.isArray(obj) ? [] : Object.create(Object.getPrototypeOf(obj));
  hash.set(obj, clone);
  const keys = Reflect.ownKeys(obj); // 包含 symbol keys
  for (const key of keys) {
    clone[key] = deepClone(obj[key], hash);
  }
  return clone;
};

/**
 * 物件key重命名
 * @param {object} obj 傳入值
 * @param {object} keys 想要重命名的key組成的物件
 * @example obj = renameKeys(obj, { line_uid: "lineUid", is_past: "isPast" });
 */
const renameKeys = (obj, keys = {}) => {
  if (typeof obj !== "object" || obj === null) return {};
  const result = {};
  for (const key in obj) {
    const newKey = keys.hasOwnProperty(key) ? keys[key] : key;
    result[newKey] = obj[key];
  }
  return result;
};

//-----------------------Time-----------------------
/**
 * 判斷日期是否存在
 * @param {string} date 日期字串
 * @param {string} split 分割符 預設為"-"
 * @example isExistDate("2020-02-29"); -> true
 * @example isExistDate("2019/02/29", "/"); -> false
 */
const isExistDate = (date, split = "-") => {
  if (typeof date !== "string" || !date.includes(split)) return false;
  const dateArr = date.split(split);
  if (dateArr.length !== 3) return false;
  const year = parseInt(dateArr[0], 10);
  const month = parseInt(dateArr[1], 10);
  const day = parseInt(dateArr[2], 10);
  if (
    isNaN(year) || isNaN(month) || isNaN(day) ||
    month < 1 || month > 12 || day < 1
  ) {
    return false;
  }
  const testDate = new Date(year, month - 1, day);
  return (
    testDate.getFullYear() === year &&
    testDate.getMonth() === month - 1 &&
    testDate.getDate() === day
  );
};

/**
 * 取得前後幾天的日期
 * @param {number} days 指定天數 可為負值
 * @example getDiffDate(1); -> "2020-07-01"
 * @example getDiffDate(0); -> "2020-06-30"
 * @example getDiffDate(-2); -> "2020-06-28"
 */
const getDiffDate = (days = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
};

/**
 * 時間格式化
 * @param {any} date 傳入值(Date物件、timestamp或任何合法時間格式)
 * @param {string} format 轉換格式 預設值為'yyyy-MM-dd hh:mm:ss'
 * @example formatTime(new Date(), 'yyyyMMdd') -> "20210726"
 * @example formatTime(new Date(), 'yyyy-MM-dd') -> "2021-07-26"
 * @example formatTime(new Date(), 'yyyy-MM-dd hh:mm:ss') -> "2021-07-26 14:08:00"
 * @example formatTime(new Date(1627280134101), 'yyyy-MM-dd hh:mm:ss') -> "2021-07-26 14:15:34"
 */
const formatTime = (input = new Date(), format = "yyyy-MM-dd HH:mm:ss") => {
  const date = input instanceof Date ? input : new Date(input);
  if (isNaN(date.getTime())) return "Invalid Date";
  const map = {
    "M+": date.getMonth() + 1, // 月 (1-12)
    "d+": date.getDate(), // 日 (1-31)
    "H+": date.getHours(), // 小時 (0-23)
    "h+": date.getHours() % 12 || 12, // 小時 (1-12)
    "m+": date.getMinutes(), // 分 (0-59)
    "s+": date.getSeconds(), // 秒 (0-59)
    "q+": Math.floor((date.getMonth() + 3) / 3), // 季度 (1-4)
    "S": date.getMilliseconds() // 毫秒 (0-999)
  };
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (date.getFullYear() + "").slice(4 - RegExp.$1.length));
  }
  for (let key in map) {
    if (new RegExp("(" + key + ")").test(format)) {
      const val = map[key] + "";
      format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? val : val.padStart(RegExp.$1.length, "0"));
    }
  }
  return format;
};

//-----------------------DOM-----------------------
/**
 * 滾動至指定位置
 * @param {string|number} el 滾動位置('top': 頂部, 'bottom': 底部, '.foobar': 元素, 300: 像素)
 * @param {number} speed 滾動時間(瞬移為1,請勿設為0)
 * @param {number} offset 自定偏移(可接受正負數字)
 * @param {function} callback 回調函式
 * @example scrollToTarget(); -> 滾動回項部
 * @example scrollToTarget('top', 1); -> 瞬間回項部
 * @example scrollToTarget('.foobar', 10, -30, () => {console.log('滾動完成')});
 */
const scrollToTarget = (el = "top", speed = 5, offset = 0, callback = () => {}) => {
  if (speed <= 0) speed = 1;
  const scrollingElement = document.scrollingElement || document.documentElement || document.body;
  let currentScroll = scrollingElement.scrollTop;
  let targetTop = 0;
  if (typeof el === 'number') {
    targetTop = el + offset;
  } else if (el === 'top') {
    targetTop = 0 + offset;
  } else if (el === 'bottom') {
    targetTop = scrollingElement.scrollHeight - window.innerHeight + offset;
  } else {
    const targetEl = document.querySelector(el);
    if (!targetEl) {
      console.warn(`scrollToTarget: 找不到元素 "${el}"，滾動至頂部`);
      targetTop = 0 + offset;
    } else {
      const rect = targetEl.getBoundingClientRect();
      targetTop = currentScroll + rect.top + offset;
    }
  }
  targetTop = Math.max(0, Math.min(targetTop, scrollingElement.scrollHeight - window.innerHeight));
  const stepScroll = () => {
    currentScroll += (targetTop - currentScroll) / speed;
    if (Math.abs(currentScroll - targetTop) <= 1) {
      scrollingElement.scrollTop = targetTop;
      callback();
      return;
    }
    scrollingElement.scrollTop = currentScroll;
    requestAnimationFrame(stepScroll);
  };
  stepScroll();
};

/**
 * 取得頁面當前捲動長寬度
 * @param {string} type 類型(width: 寬度, height: 高度)
 */
const getPageScroll = (type = 'height') => {
  if (type === 'width') {
    return window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0;
  }
  if (type === 'height') {
    return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
  }
  throw new Error(`Invalid type: ${type}. Use "width" or "height".`);
};

/**
 * 取得頁面尺寸
 * @param {string} scope 範圍(view: 可視頁面, full: 完整頁面)
 */
const getPageSize = (scope = 'view') => {
  const el = document.compatMode === "BackCompat" ? document.body : document.documentElement;
  if (scope === 'view') {
    return [el.clientWidth, el.clientHeight];
  }
  if (scope === 'full') {
    return [
      Math.max(document.documentElement.scrollWidth, document.body.scrollWidth, el.clientWidth),
      Math.max(document.documentElement.scrollHeight, document.body.scrollHeight, el.clientHeight)
    ];
  }
  throw new Error(`Invalid scope: ${scope}. Use "view" or "full".`);
};

//-----------------------Verify-----------------------
/**
 * 常用驗證函式
 * @param {any} val 傳入值
 * @param {string|regex} type 驗證類型(可接受正則表達式)
 * @example isVerify('1988-05-27', 'date') -> true
 * @example isVerify('ABC', /[A-Z]/) -> true
 */
const isVerify = (val, type) => {
  if(val == null) return val;
  switch (type) {
    // 姓名驗證
    case "name":
      return /^[\p{sc=Han}a-zA-Z·\s]+$/u.test(val);
    // 電話驗證
    case "phone":
      return /^09[0-9]{8}$/.test(val);
    // 電子郵件驗證
    case "email":
      return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(val);
    // 統一編號驗證
    case "uniform":
      return /^[0-9]{8}$/.test(val);
    // 身分證字號驗證
    case "idcard":
      return /^[A-Z](1|2)[0-9]{8}$/.test(val);
    // 日期驗證
    case "date":
      return /^(?:(?!0000)[0-9]{4}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29)$/.test(val);
    // 數字驗證
    case "number":
      return /^\d+$/.test(val);
    // 網址驗證
    case "url":
      return /^https?:\/\/([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}([/?#][^\s]*)?$/i.test(val);
    // IP地址驗證
    case "ip":
      return /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(val);
    // Hex色碼驗證
    case "hex":
      return /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/.test(val);
    // 身分證字號驗證
    case "id":
      let letters = new Array('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'X', 'Y', 'W', 'Z', 'I', 'O');
      let multiply = new Array(1, 9, 8, 7, 6, 5, 4, 3, 2, 1);
      let nums = new Array(2);
      let firstChar;
      let firstNum;
      let lastNum;
      let total = 0;
      let regExpID=/^[a-z](1|2)\d{8}$/i; 
      if(val.search(regExpID)==-1) {
        return false;
      }else {
        firstChar = val.charAt(0).toUpperCase();
        lastNum = val.charAt(9);
      }
      for(var i=0; i<26; i++) {
        if(firstChar == letters[i]) {
          firstNum = i + 10;
          nums[0] = Math.floor(firstNum / 10);
          nums[1] = firstNum - (nums[0] * 10);
          break;
        } 
      }
      for(var i=0; i<multiply.length; i++){
        if(i<2) {
          total += nums[i] * multiply[i];
        }else {
          total += parseInt(val.charAt(i-1)) * multiply[i];
        }
      }
      if((10 - (total % 10))!= lastNum) {
        return false;
      } 
      return true;
    // 正則表達式驗證
    default:
      let regexMode = new RegExp(type);
      return regexMode.test(val);
  }
}

/**
 * 精準數字驗證
 * @param {any} val 傳入值
 */
const isNumber = (val) => {
  return typeof val === 'number' && !isNaN(val);
};

/**
 * 未填入驗證
 * @param {any} val 傳入值
 */
const isEmpty = (val) => {
  if (val === null || val === undefined) return true;
  if (typeof val === 'string') return val.trim().length === 0;
  if (typeof val === 'boolean') return !val;
  if (typeof val === 'number') return false;
  if (Array.isArray(val)) return val.length === 0 || val.some(i => isEmpty(i));
  if (typeof val === 'object') return Object.keys(val).length === 0;
  return false;
};

//-----------------------Web-----------------------
/**
 * 函式防抖
 * @description 將幾次操作合併為一次操作進行
 * @param {function} fn 處理函式
 * @param {number} delay 停止後等待時間 預設為1000ms
 * @example window.addEventListener('scroll', debounce(() => console.log("debounce"), 500));
 */
const debounce = (fn, delay = 1000) => {
  let timer = null;
  return function (...args) {
    const context = this;
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(context, args);
    }, delay);
  };
}

/**
 * 函式節流
 * @description 一定時間內只觸發一次函式
 * @param {function} fn 處理函式
 * @param {number} delay 處理間隔時間 預設為1000ms
 * @example window.addEventListener('scroll', throttle(() => console.log("throttle"), 2000));
 */
const throttle = (fn, delay = 1000) => {
  let last = 0;
  return function (...args) {
    const context = this;
    const now = Date.now();
    if (now - last >= delay) {
      last = now;
      fn.apply(context, args);
    }
  };
}

/**
 * 查詢網址所帶參數
 * @param {string} query 指定查詢參數名稱，若不傳則回傳全部參數
 * @param {string} url 網址
 * @example queryString("id", "https://foo?id=123") -> "123"
 */
const queryString = (key, url = location.href) => {
  const params = new URL(url).searchParams;
  if (!key) {
    return Object.fromEntries(params.entries());
  }
  return params.get(key);
};

/**
 * 判斷是否移動裝置
 * @param {string} os 作業系統('': 所有機型, apple: 蘋果, android: 安卓)
 */
const isMobile = (os = "") => {
  const ua = navigator.userAgent.toLowerCase();
  const matchers = {
    apple: /iphone|ipod|ipad|macintosh/i,
    android: /android/i,
    all: /iphone|ipod|ipad|android.*mobile|windows.*phone|blackberry.*mobile/i,
  };
  if (os === 'apple') return matchers.apple.test(ua);
  if (os === 'android') return matchers.android.test(ua);
  return matchers.all.test(ua);
};