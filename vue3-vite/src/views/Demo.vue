<template lang="pug">
#demo
  ud-modal(v-model="isModalShow")
    h4.mb-2 通用彈窗
    ud-image.mb-3(:src="''" :alt="''")
    .button-wrapper.mb-2
      ud-button(@click="alert()") Alert
      ud-button(@click="showLoading") Loading
    ud-button(@click="isModalShow = false" plain) 關閉

  .form-area
    ud-form(:rules="rules" :model="formData" ref="form")
      ud-form-item(label="姓名" prop="name" flex required)
        ud-input(ref="name" v-model.trim="formData.name" placeholder="請輸入您的姓名")
      ud-form-item(label="電話" prop="phone" flex)
        template(#label)
          p 電話#[span.required (必填)]
        ud-input(v-model.trim="formData.phone" placeholder="請輸入您的手機號碼" inputmode="tel" maxlength="10")
      ud-form-item(label="Email" prop="email" flex)
        ud-input(v-model.trim="formData.email" placeholder="請輸入您的Email" inputmode="email")
      ud-form-item(label="年齡" prop="age" flex)
        ud-input(v-model.trim.number="formData.age" placeholder="請輸入您的年齡" inputmode="numeric")
      ud-form-item(label="備註" prop="note" flex)
        ud-textarea(ref="note" v-model="formData.note" placeholder="請輸入您的備註" show-limit maxlength="100")
      ud-form-item(label="單選" prop="radio" flex)
        ud-radio(v-model="formData.radio" :options="options" flex)
      ud-form-item(label="多選" prop="checkbox" flex)
        ud-checkbox(v-model="formData.checkbox" :options="options" flex)
      ud-form-item(label="下拉" prop="select" flex)
        ud-select(v-model="formData.select" :options="options" flex center)
      ud-form-item(label="下拉連動" prop="selectGroup" flex)
        .select-wrapper
          ud-select(v-model="formData.selectGroup[0]" :options="storeOptions" :group="formData.selectGroup" :index="0" placeholder="縣市")
          ud-select(v-model="formData.selectGroup[1]" :options="storeOptions" :group="formData.selectGroup" :index="1" placeholder="櫃點")
          ud-select(v-model="formData.selectGroup[2]" :options="storeOptions" :group="formData.selectGroup" :index="2" placeholder="時段")
      ud-form-item(label="預約日期" prop="date" flex)
        ud-select-date(v-model="formData.date" flex third roc)
          template(#first)
            p 年
          template(#second)
            p 月
          template(#third)
            p 日
      ud-form-item(label="地址" prop="twzip" flex)
        ud-select-twzip(ref="zip" v-model="formData.twzip" flex)
      ud-form-item(label="是否啟用" prop="isActive" flex)
        ud-switch(v-model="formData.isActive" activeValue="Y" inactiveValue="N")
      ud-form-item(label="驗證碼" prop="captcha" flex)
        .captcha-wrapper
          ud-input(v-model="formData.captcha" placeholder="驗證碼" maxlength="4")
          ud-captcha(v-model="formData.captchaCode" noRefresh)
      ud-form-item(label="" prop="isAgree")
        ud-checkbox(v-model="formData.isAgree")
          p 我同意#[a(href="https://www.google.com.tw/") 使用者條款]
    .button-wrapper.mb-2
      ud-button(@click="clearVerify" plain) 清除驗證
      ud-button(@click="submitVerify") 送出表單

  .layout-area
    hr
    .collapse-wrapper.mb-2
      .collapse-button-wrapper
        .arrow-wrapper(:class="{'is-collapse': isCollapse}")
          ud-arrow(color="#fff" size="8" width="5" direction="down" type="solid")
        ud-button(@click="isCollapse = !isCollapse") 摺疊容器
      ud-collapse(v-model="isCollapse" :duration="0.4")
        ud-image(:src="image03" bg-size="contain")
    .image-wrapper.mb-2
      img(src="@/assets/01.jpg", alt="")
      img(:src="image02", alt="")
      img(src="https://imgur.com/DIC7dRT.jpg", alt="")
      ud-image(src="@/assets/01.jpg", alt="UdImage請用import的圖片不然讀不到圖")
      ud-image(:src="image02", alt="")
      ud-image(src="https://imgur.com/DIC7dRT.jpg", alt="")

  .notice-area
    hr
    .button-wrapper.mb-2
      ud-button(@click="alert()") Alert
      ud-button(@click="isModalShow = true" plain) Modal
      ud-button(@click="showLoading") Loading

  .tools-area
    hr
    ud-html.mb-2(text="<i>用戶</i>自定\n<h3>義訊息</h3><h1 class='title'>h1標題</h1><h2>h2副標題</h2><h3>h3小標題</h3><h4>h4小標題</h4><h5>h5小標題</h5><h6>h6小標題</h6><p>p文字</p><span>span行內文字</span>")
    ud-ellipsis.mb-2(:max-line="2") 文字省略文字省略文字省略文字省略文字省略文字省略文字省略文字省略文字省略文字省略文字省略文字省略文字省略文字省略文字省略
    ud-countdown.mb-2(
      :time="120"
      delay
      ref="countdown"
      type="minute"
      text
      @timeup="udAlert('時間到！')"
    )
    .button-wrapper.mb-2
      ud-button(@click="$refs.countdown.countdown()") 開始
      ud-button(@click="$refs.countdown.pause()" plain) 暫停
      ud-button(@click="$refs.countdown.resume()") 恢復
      ud-button(@click="$refs.countdown.reset()" plain) 重置

  .api-area
    hr
    .button-wrapper.mb-2
      ud-button(@click="getData") GET
      ud-button(@click="postData") POST

  .liff-area
    hr
    .liff-wrapper.mb-2
      ud-image(:src="profile.pictureUrl", alt="")
      .profile-wrapper
        h6 {{ profile.displayName }}
        p {{ profile.userId }}
        p {{ profile.info }}
    .button-wrapper.mb-2
      ud-button(@click="sendMessage" plain) 傳送訊息
      ud-button(@click="shareTargetPicker" plain) 好友分享

  .advanced-form-area
    hr
    h4.mb-3 進階驗證規則測試
    ud-form(:rules="advancedRules" :model="advancedFormData" ref="advancedForm")
      ud-form-item(label="密碼" prop="password" flex)
        ud-input(v-model.trim="advancedFormData.password" placeholder="請輸入密碼" type="password")
      ud-form-item(label="確認密碼" prop="confirmPassword" flex)
        ud-input(v-model.trim="advancedFormData.confirmPassword" placeholder="請再次輸入密碼" type="password")
      ud-form-item(label="自定義正則" prop="customRegex" flex)
        ud-input(v-model.trim="advancedFormData.customRegex" placeholder="只能輸入英文字母")
      ud-form-item(label="自定義驗證" prop="customValidation" flex)
        ud-input(v-model.trim="advancedFormData.customValidation" placeholder="輸入 'test' 通過驗證")
      ud-form-item(label="數字範圍" prop="numberRange" flex)
        ud-input(v-model.trim="advancedFormData.numberRange" placeholder="輸入 1-100 之間的數字")
      ud-form-item(label="特殊字符檢查" prop="specialChars" flex)
        ud-input(v-model.trim="advancedFormData.specialChars" placeholder="不能包含 < > \" ' & 字符")
    .button-wrapper.mb-2
      ud-button(@click="clearAdvancedVerify" plain) 清除進階驗證
      ud-button(@click="submitAdvancedVerify") 送出進階表單

</template>

<script>
import image01 from "@/assets/01.jpg";
import image02 from "@/assets/02.jpg";
import image03 from "@/assets/03.jpg";
import liff from "@line/liff";

export default {
  name: "Demo",
  components: {},
  data() {
    return {
      image01,
      image02,
      image03,
      isModalShow: false,
      isCollapse: false,
      profile: {
        userId: "",
        displayName: "",
        pictureUrl: "",
        info: ""
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
        isActive: "N",
        captcha: "",
        captchaCode: "",
        isAgree: false
      },
      advancedFormData: {
        password: "",
        confirmPassword: "",
        customRegex: "",
        customValidation: "",
        numberRange: "",
        specialChars: ""
      },
      rules: {
        name: [{ type: "required" }, { type: "name" }],
        phone: [{ type: "required" }, { type: "phone" }],
        email: [{ type: "required" }, { type: "email" }],
        age: [{ type: "required" }, { type: "number" }],
        note: [{ type: "required" }],
        radio: [{ type: "required" }],
        checkbox: [{ type: "required" }],
        select: [{ type: "required" }],
        selectGroup: [{ type: "required" }],
        twzip: [{ type: "required" }],
        date: [{ type: "required" }],
        captcha: [{ type: "required" }, { type: "equal", equalTo: "captchaCode", caseIgnore: "true" }],
        isAgree: [{ type: "required", message: "請先同意相關使用條款" }]
      },
      advancedRules: {
        password: [
          { type: "required", message: "密碼為必填項目" },
          { type: "regex", regex: "^.{6,}$", message: "密碼至少需要6個字符" }
        ],
        confirmPassword: [
          { type: "required", message: "確認密碼為必填項目" },
          {
            type: "equal",
            equalTo: "password",
            message: "兩次輸入的密碼不一致"
          }
        ],
        customRegex: [{ type: "required" }, { type: "regex", regex: "^[a-zA-Z]+$", message: "只能輸入英文字母" }],
        customValidation: [
          {
            type: "schema",
            schema: value => value === "test",
            message: "請輸入 'test' 來通過驗證"
          }
        ],
        numberRange: [
          { type: "number", message: "只能輸入數字" },
          {
            type: "schema",
            schema: value => {
              const num = parseInt(value);
              return num >= 1 && num <= 100;
            },
            message: "數字必須在 1-100 之間"
          }
        ],
        specialChars: [
          {
            type: "regex",
            regex: "^[^<>\"'&]*$",
            message: "不能包含特殊字符 < > \" ' &"
          }
        ]
      },
      options: [
        { label: "甲", value: 1 },
        { label: "乙", value: "2" },
        { label: "丙", value: "3", disabled: true }
      ],
      storeOptions: [
        {
          label: "台北市",
          value: "taipei",
          children: [
            {
              label: "中正區",
              value: "100",
              children: [
                { label: "2023-12-01", value: 1 },
                { label: "2023-12-02", value: "2", disabled: "true" }
              ]
            },
            {
              label: "大安區",
              value: "106",
              disabled: true,
              children: [
                { label: "2023-12-03", value: "3" },
                { label: "2023-12-04", value: "4" }
              ]
            },
            {
              label: "信義區",
              value: "110",
              children: [
                { label: "2023-12-05", value: "5" },
                { label: "2023-12-06", value: "6" }
              ]
            }
          ]
        },
        {
          label: "新北市",
          value: "newTaipei",
          children: [
            {
              label: "板橋區",
              value: "220",
              children: [
                { label: "2023-12-07", value: "7" },
                { label: "2023-12-08", value: "8" }
              ]
            },
            {
              label: "永和區",
              value: "234",
              children: [
                { label: "2023-12-09", value: "9" },
                { label: "2023-12-10", value: "10", disabled: true }
              ]
            },
            {
              label: "新店區",
              value: "231",
              children: [
                { label: "2023-12-11", value: "11", disabled: true },
                { label: "2023-12-12", value: "12", disabled: true }
              ]
            }
          ]
        }
      ]
    };
  },
  computed: {},
  mounted() {
    this.udLoading.open();
    setTimeout(() => {
      this.udLoading.close();
    }, 200);
    this.liffLogin();
  },
  methods: {
    getData() {
      this.udAxios
        .get("test/400/失敗了", {
          noAlert: false
        })
        .then(res => {
          console.log("res: ", res);
        });
    },
    postData() {
      this.udAxios
        .post("test", {
          name: "UDON"
        })
        .then(res => {
          console.log("res: ", res);
        });
    },
    alert() {
      this.udAlert({
        message: "這是一個警告訊息",
        title: "警告",
        confirm: true
      })
        .then(() => {
          console.log("確定");
          this.udAlert(123);
        })
        .catch(() => {
          console.log("取消");
        });
    },
    submitVerify() {
      this.$refs.form.validate(() => {
        this.submit();
      });
    },
    submit() {
      this.udAlert({ message: "驗證成功!!" });
    },
    clearVerify() {
      this.$refs.form.clearValidate();
    },
    submitAdvancedVerify() {
      this.$refs.advancedForm.validate(() => {
        this.submitAdvanced();
      });
    },
    submitAdvanced() {
      this.udAlert({ message: "進階驗證成功!!" });
    },
    clearAdvancedVerify() {
      this.$refs.advancedForm.clearValidate();
    },
    toUrl(url) {
      location.href = url;
    },
    showLoading() {
      this.udLoading.open();
      setTimeout(() => {
        this.udLoading.close();
      }, 1000);
    },
    formatHtml(val) {
      return this.nl2br(val);
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
          liffId: import.meta.env.VITE_APP_LINE_LIFF_ID
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
            .then(data => {
              if (data.friendFlag) {
                liff.getProfile().then(res => {
                  this.profile = res;
                  this.profile.info =
                    liff.isInClient() + ", " + liff.getOS() + ", " + liff.getLineVersion() + ", " + liff.getLanguage();
                });
              } else {
                location.href = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${
                  LINE_LOGIN_CHANNEL_ID
                }&redirect_uri=${encodeURIComponent(
                  location.href
                )}&scope=profile%20openid%20phone%20email&bot_prompt=aggressive&prompt=consent&state=${Date.now()}`;
              }
            })
            .catch(() => {
              this.udAlert(`LIFF初始化失敗，請稍後再試`).then(() => {
                location.href = import.meta.env.VITE_APP_LINE_ADD_FRIEND_LINK;
              });
            });
        })
        .catch(err => {
          this.udAlert(`[${err.code}] ${err.message}\nLIFF初始化失敗，請稍後再試`).then(() => {
            location.href = import.meta.env.VITE_APP_LINE_ADD_FRIEND_LINK;
          });
        });
    },
    sendMessage() {
      liff
        .sendMessages([
          {
            type: "text",
            text: "Hello, World!(sendMessages)"
          }
        ])
        .then(() => {
          console.log("Message sent successfully!");
        })
        .catch(err => {
          console.error("Error sending message:", err);
        });
    },
    shareTargetPicker() {
      if (!liff.isApiAvailable("shareTargetPicker")) {
        this.udAlert("您的設備不支援好友分享功能\n請更新手機系統或LINE版本").then(() => {
          location.href = import.meta.env.VITE_APP_LINE_ADD_FRIEND_LINK;
        });
        return;
      }
      // shareTargetPicker只能在LIFF或外部瀏覽器(除了LINE內建瀏覽器)使用
      if (!liff.isInClient() && liff.getLineVersion()) {
        this.udAlert("請點擊活動LIFF連結進入頁面\n才可使用好友分享功能").then(() => {
          location.href = import.meta.env.VITE_APP_LINE_ADD_FRIEND_LINK;
        });
        return;
      }
      liff
        .shareTargetPicker([
          {
            type: "text",
            text: "Hello, World!(shareTargetPicker)"
          }
        ])
        .then(res => {
          if (res) {
            this.udAlert("分享成功！").then(() => {
              liff.closeWindow();
            });
          } else {
            const [majorVer, minorVer] = (liff.getLineVersion() || "").split(".");
            if (parseInt(majorVer) == 10 && parseInt(minorVer) < 11) {
              // LINE 10.3.0 - 10.10.0
              this.udAlert("您的 LINE 版本較舊，可能會造成無法分享成功。若分享失敗，請升級 LINE APP 後再嘗試。");
              return;
            }
            this.udAlert("已取消分享"); // LINE 10.11.0 -
          }
        })
        .catch(error => {
          this.udAlert({
            message: `${error.code === "EXCEPTION_IN_SUBWINDOW" ? "請在 LINE APP中 開啟活動\n以便使用好友分享功能" : "訊息分享失敗，請稍後再試"}\n[${error.code}] ${error.message}`
          }).then(() => {
            location.href = import.meta.env.VITE_APP_LINE_ADD_FRIEND_LINK;
          });
        });
    }
  }
};
</script>

<style lang="sass" scoped>
.form-area
  .ud-form-item
    span.required
      color: $red
      margin-left: 2px
  .select-wrapper
    display: flex
    justify-content: space-between
    gap: 5px
    .ud-select
      flex: 1 1 0
  .captcha-wrapper
    display: flex
    align-items: center
    width: 100%
    .ud-input
      flex: 1 1 0
      margin-right: 5px

.liff-area
  .liff-wrapper
    display: flex
    align-items: center
    margin-bottom: 10px
    .ud-image
      flex: 0 0 15%
      border-radius: 50%
      overflow: hidden
    .profile-wrapper
      margin-left: 10px
      h6
        font-family: "DINCondensedBold", "LXGW WenKai TC"
      p
        color: #999
        font-size: 14px

.button-wrapper
  display: flex
  justify-content: space-between
  gap: 10px
  .ud-button
    flex: 1 1 0

.layout-area
  .collapse-wrapper
    .collapse-button-wrapper
      position: relative
      .arrow-wrapper
        position: absolute
        right: 15px
        top: 12px
        z-index: 1
        transition: all 0.2s ease
        &.is-collapse
          transform: rotate(180deg)
  .image-wrapper
    display: flex
    justify-content: space-between
    img, .ud-image
      flex: 0 0 16%
      max-width: 16%

.tools-area
  .countdown-wrapper
    display: flex
    justify-content: space-between
    gap: 10px
    .ud-button
      flex: 1 1 0
</style>
