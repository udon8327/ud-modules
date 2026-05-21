<template>
  <div class="ud-select-twzip" :class="{ 'is-flex': flex }">
    <ud-select
      :modelValue="value[0]"
      @update:modelValue="onPartChange(0, $event)"
      :options="firstArr"
      :placeholder="placeholder[0]"
      @validate="validate"
    ></ud-select>
    <slot></slot>
    <ud-select
      :modelValue="value[1]"
      @update:modelValue="onPartChange(1, $event)"
      :options="secondArr"
      :placeholder="placeholder[1]"
      @validate="validate"
    ></ud-select>
    <slot name="second"></slot>
  </div>
</template>

<script>
export default {
  name: "UdSelectTwzip",
  props: {
    modelValue: { default: null }, // 綁定值
    placeholder: {
      // placeholder值
      type: Array,
      default: () => ["請選擇縣市", "請選擇行政區"]
    },
    flex: { type: Boolean, default: false } // 是否並排
  },
  data() {
    return {
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
    };
  },
  computed: {
    value() {
      if (Array.isArray(this.modelValue)) {
        const arr = this.modelValue.slice(0, 2);
        while (arr.length < 2) arr.push("");
        return arr;
      }
      return ["", ""];
    },
    firstValue() {
      return this.value[0];
    },
    secondValue() {
      return this.value[1];
    },
    firstArr() {
      // 過濾掉無效的選項
      return this.options.filter(
        option =>
          option &&
          option.label !== undefined &&
          option.label !== null &&
          option.value !== undefined &&
          option.value !== null
      );
    },
    secondArr() {
      let temp = [];
      if (this.firstValue !== "" && this.firstValue !== null && this.firstValue !== undefined) {
        const node = this.options.find(option => option.value === this.firstValue);
        if (node && Array.isArray(node.children)) {
          // 過濾掉無效的子選項
          temp = node.children.filter(
            child =>
              child &&
              child.label !== undefined &&
              child.label !== null &&
              child.value !== undefined &&
              child.value !== null
          );
        }
      }
      return temp;
    }
  },
  watch: {},
  methods: {
    onPartChange(index, val) {
      const next = this.value.slice(0, 2);
      next[index] = val;
      if (index === 0) {
        next[1] = "";
      }
      this.$emit("update:modelValue", next);
      this.validate();
    },
    validate() {
      this.$nextTick(() => {
        this.$mitt && this.$mitt.emit && this.$mitt.emit("validate");
      });
    }
  },
  mounted() {
    // this.$on('validate', () => {
    //   this.$nextTick(() => {
    //     this.$mitt.emit("validate"); // 通知FormItem校驗
    //   })
    // })
  }
};
</script>

<style lang="sass" scoped>
.ud-select-twzip
  margin-bottom: 0
  &.is-flex
    display: flex
    justify-content: center
    align-items: center
    .ud-select
      flex: 1 1 0
      margin: 0 5px 0 0
      &:last-of-type
        margin: 0
        + span,+ p
          margin: 0 5px
      + span,+ p
        margin: 0 5px 0 0
  .ud-select
    margin-bottom: 5px
</style>
