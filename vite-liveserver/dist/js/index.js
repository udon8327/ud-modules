let vm = new Vue({
  el: "#app",
  data: {
    isRuleModalShow: false,
    pointList: [
      { id: 1, isComplete: true },
      { id: 2, isComplete: true },
      { id: 3, isComplete: true },
      { id: 4, isComplete: true },
      { id: 5, isComplete: true },
      { id: 6, isComplete: true },
      { id: 7, isComplete: true },
      { id: 8, isComplete: true },
      { id: 9, isComplete: true },
      { id: 10, isComplete: true },
      { id: 11, isComplete: true },
      { id: 12, isComplete: false },
      { id: 13, isComplete: false },
      { id: 14, isComplete: false },
      { id: 15, isComplete: false },
      { id: 16, isComplete: false },
      { id: 17, isComplete: false },
      { id: 18, isComplete: false },
    ],
    signinDay: 0,
    signinPoint: 0,
    shareDay: 0,
    sharePoint: 0,
    bomList: [
      { id: 1, url: "img/example.png", link: "https://www.google.com.tw/?hl=zh_TW" },
      { id: 2, url: "img/example.png", link: "https://www.google.com.tw/?hl=zh_TW" },
      { id: 3, url: "img/example.png", link: "https://www.google.com.tw/?hl=zh_TW" },
    ]
  },
  mounted() {
    udAxios.get("/PointCollection/selShop").then(res => {
      console.log(res);
    })
  },
  methods: {
    toUrl(val) {
        location.href = val;
    }
  }
});
