// url：https://ud-modules-vue2.udons.space/demo.html
// liff：https://liff.line.me/1655285115-w926gzYP

let vm = new Vue({
  el: "#app",
  data: {
    isModalShow: false,
    isCollapse: false,
    profile: {
      userId: "",
      displayName: "",
      pictureUrl: "",
      info: "",
    },
    formData: {
      name: "",
      phone: "",
      email: "",
      age: "",
      note: "",
      radio: "",
      checkbox: [],
      select: "",
      selectGroup: ["", "", ""],
      twzip: ["", ""],
      date: ["", "", ""],
      isActive: false,
      isAgree: false,
      birth: "",
    },
    rules: {
      name: [{type: "required"}, {type: "name" }],
      phone: [{type: "required"}, {type: "phone" }],
      email: [{type: "required"}, {type: "email" }],
      age: [{type: "required"}, {type: "number" }],
      radio: [{type: "required"}],
      checkbox: [{type: "required"}],
      select: [{type: "required"}],
      selectGroup: [{type: "required"}],
      twzip: [{type: "required"}],
      date: [{type: "required"}],
      isAgree: [{type: "required", message: "請先同意相關使用條款"},],
      birth: [{type: "required"}, {type: "date" }],
    },
    options: [
      {label: "甲", value: "a"},
      {label: "乙", value: "b"},
      {label: "丙", value: "c", disabled: true},
    ],
    storeOptions: [
      {label: "台北市", value: "taipei", children: [
        {label: "中正區", value: "100", children: [
          {label: "2023-12-01", value: "1" },
          {label: "2023-12-02", value: "2", disabled: "true" }
        ]},
        {label: "大安區", value: "106", disabled: true, children: [
          {label: "2023-12-03", value: "3" },
          {label: "2023-12-04", value: "4" },
        ]},
        {label: "信義區", value: "110", children: [
          {label: "2023-12-05", value: "5" },
          {label: "2023-12-06", value: "6" },
        ]},
      ]},
      {label: "新北市", value: "newTaipei", children: [
        {label: "板橋區", value: "220", children: [
          {label: "2023-12-07", value: "7" },
          {label: "2023-12-08", value: "8" },
        ]},
        {label: "永和區", value: "234", children: [
          {label: "2023-12-09", value: "9" },
          {label: "2023-12-10", value: "10", disabled: true },
        ]},
        {label: "新店區", value: "231", children: [
          {label: "2023-12-11", value: "11", disabled: true },
          {label: "2023-12-12", value: "12", disabled: true },
        ]},
      ]},
    ],
    lang: {
      formatLocale: {
        monthsShort: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
        weekdaysMin: ['日', '一', '二', '三', '四', '五', '六'],
      },
      yearFormat: 'YYYY 年',
      monthFormat: 'MMM 月',
      monthBeforeYear: false,
    }
  },
  computed: {
  },
  mounted() {
    this.liffLogin();
  },
  methods: {
    onInput(e) {
      console.log('e: ', e);
    },
    test() {
      console.log(getRandom());
    },
    openExternal() {
      location.href = "https://liff.line.me/1655285115-w926gzYP";
      // liff.openWindow(
      //   { url: "https://liff.line.me/1655285115-w926gzYP", external: true }
      // );
    },
    liffLogin() {
      liff
        .init({
          liffId: LINE_LIFF_ID,
        })
        .then(() => {
          // 檢查是否登入
          if (!liff.isLoggedIn()) {
            liff.login({ redirectUri: location.href });
            return;
          }
          // 檢查是否好友
          liff
            .getFriendship()
            .then((data) => {
              if (data.friendFlag) {
                liff.getProfile().then((res) => {
                  this.profile = res;
                  this.profile.info = 
                    liff.isInClient() + ", " + 
                    liff.getOS() + ", " + 
                    liff.getLineVersion() + ", " + 
                    liff.getLanguage();
                })
              } else {
                location.href = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${
                  LINE_LOGIN_CHANNEL_ID
                }&redirect_uri=${encodeURIComponent(
                  location.href
                )}&scope=profile%20openid%20phone%20email&bot_prompt=aggressive&prompt=consent&state=${Date.now()}`;
              }
            })
            .catch(() => {
              udAlert(`LIFF初始化失敗，請稍後再試`).then(() => {
                location.href = LINE_OA_URL;
              });
            });
        })
        .catch((err) => {
          udAlert(`[${err.code}] ${err.message}\nLIFF初始化失敗，請稍後再試`).then(() => {
            location.href = LINE_OA_URL
          });
        });
    },
    getData() {
      udAxios.get("https://script.google.com/macros/s/AKfycbxvo8_MufuGmGvoiRp90SFAq3_It-FKE7qjKPBFVLMqjx_dfgp60ILhuQEoHxuJa_FV/exec").then((res) => {
        console.log('res: ', res);
      });
    },
    postData() {
      let data = {
        name: "Bohan",
        email: "bohan@example.com",
      };
      udAxios.post("https://script.google.com/macros/s/AKfycbxvo8_MufuGmGvoiRp90SFAq3_It-FKE7qjKPBFVLMqjx_dfgp60ILhuQEoHxuJa_FV/exec", data).then((res) => {
        console.log('res: ', res);
      })
    },
    alert() {
      udAlert("警告\n彈窗");
    },
    timeup() {
      udAlert('時間到！');
    },
    countdown() {
      this.$refs.cd.countdown();
    },
    reset() {
      this.$refs.cd.reset();
    },
    submitVerify() {
      this.$refs.form.validate(() => {
        this.submit();
      });
    },
    submit() {
      this.udAlert({msg: "驗證成功!!"});
    },
    clearVerify() {
      this.$refs.form.clearValidate();
    },
    toUrl(url) {
      location.href = url;
    },
    sendMessage() {
      liff.sendMessages([
        {
          "type": "text",
          "text": "Hello, World!(sendMessages)"
        }
      ])
        .then(() => {
            console.log('Message sent successfully!');
        })
        .catch((err) => {
            console.error('Error sending message:', err);
        });
    },
    shareTargetPicker() {
      if (!liff.isApiAvailable('shareTargetPicker')) {
        this.udAlert(
          "您的設備不支援好友分享功能\n請更新手機系統或LINE版本"
        ).then(() => {
          location.href = LINE_OA_URL;
        });
        return;
      }
      // shareTargetPicker只能在LIFF或外部瀏覽器(除了LINE內建瀏覽器)使用
      if (!liff.isInClient() && liff.getLineVersion()) {
        this.udAlert(
          "請點擊活動LIFF連結進入頁面\n才可使用好友分享功能"
        ).then(() => {
          location.href = LINE_OA_URL;
        });
        return;
      }
      liff.shareTargetPicker([
        {
          "type": "text",
          "text": "Hello, World!(shareTargetPicker)"
        }
      ])
        .then((res) => {
          if (res) {
            this.udAlert("分享成功！").then(() => {
              liff.closeWindow();
            })
          } else {
            const [majorVer, minorVer] = (liff.getLineVersion() || "").split('.');
            if (parseInt(majorVer) == 10 && parseInt(minorVer) < 11) { // LINE 10.3.0 - 10.10.0
              this.udAlert(
                "您的 LINE 版本較舊，可能會造成無法分享成功。若分享失敗，請升級 LINE APP 後再嘗試。"
              );
              return;
            }
            this.udAlert("已取消分享"); // LINE 10.11.0 -
          }
        })
        .catch((error) => {
          this.udAlert({
            msg: `${error.code === 'EXCEPTION_IN_SUBWINDOW' ? '請在 LINE APP中 開啟活動\n以便使用好友分享功能' : '訊息分享失敗，請稍後再試'}\n[${error.code}] ${error.message}`,
          }).then(() => {
            location.href = LINE_OA_URL;
          })
        });
    },
  }
});