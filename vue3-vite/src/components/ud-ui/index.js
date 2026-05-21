/*
==================== ud-modules 常用組件 ====================
Form
  ud-button：按鈕 (ok AI Tested)
  ud-input：輸入框 (ok AI Tested TODO：lazy修飾子無效)
  ud-textarea：多行輸入框 (ok AI Tested TODO：lazy修飾子無效)
  ud-radio：單選框 (ok AI Tested)
  ud-checkbox：多選框 (ok AI Tested)
  ud-select：下拉框 (ok AI Tested)
  ud-select-date：日期連動下拉框 (ok AI Tested)
  ud-select-twzip：台灣行政區連動下拉框 (ok AI Tested)
  ud-switch：開關 (ok AI Tested)
  ud-captcha：圖形驗證碼 (ok AI Tested)
  ud-form-item：表單驗證容器 (ok AI Tested)
  ud-form：表單驗證 (ok AI Tested)

Layout
  ud-arrow：CSS箭頭 (ok AI Tested)
  ud-collapse：摺疊容器 (ok AI Tested)
  ud-image：等比例自適應圖片 (ok AI Tested)

Notice
  ud-alert：警告彈窗 (ok AI Tested)
  ud-modal：通用彈窗 (ok AI Tested)
  ud-loading：載入中 (ok AI Tested)

Tools
  ud-html：用戶自定義訊息 (ok AI Tested)
  ud-ellipsis：文字省略 (ok AI Tested)
  ud-countdown：倒數計時 (ok AI Tested)
*/

import { createVNode, render } from "vue";
import udAxios from "@/services/ud-axios";
import * as udUtils from "@/utils/ud-utils";

import UdAlert from "./UdAlert.vue";
import UdArrow from "./UdArrow.vue";
import UdButton from "./UdButton.vue";
import UdCaptcha from "./UdCaptcha.vue";
import UdCheckbox from "./UdCheckbox.vue";
import UdCollapse from "./UdCollapse.vue";
import UdCountdown from "./UdCountdown.vue";
import UdEllipsis from "./UdEllipsis.vue";
import UdForm from "./UdForm.vue";
import UdFormItem from "./UdFormItem.vue";
import UdHtml from "./UdHtml.vue";
import UdImage from "./UdImage.vue";
import UdInput from "./UdInput.vue";
import UdLoading from "./UdLoading.vue";
import UdModal from "./UdModal.vue";
import UdRadio from "./UdRadio.vue";
import UdSelect from "./UdSelect.vue";
import UdSelectDate from "./UdSelectDate.vue";
import UdSelectTwzip from "./UdSelectTwzip.vue";
import UdSwitch from "./UdSwitch.vue";
import UdTextarea from "./UdTextarea.vue";

// 組件註冊列表
const udComponents = [
  UdAlert,
  UdArrow,
  UdButton,
  UdCaptcha,
  UdCheckbox,
  UdCollapse,
  UdCountdown,
  UdEllipsis,
  UdForm,
  UdFormItem,
  UdHtml,
  UdImage,
  UdInput,
  UdLoading,
  UdModal,
  UdRadio,
  UdSelect,
  UdSelectDate,
  UdSelectTwzip,
  UdSwitch,
  UdTextarea
];

// 組件呼叫方法
// udAlert
const udAlert = options => {
  try {
    const container = document.createElement("div");
    document.body.appendChild(container);

    const props = typeof options === "string" || typeof options === "number" ? { message: options } : options || {};
    const vnode = createVNode(UdAlert, props);

    render(vnode, container);
    const instance = vnode.component?.proxy;

    if (!instance) {
      // 清理容器如果實例創建失敗
      if (container.parentNode) {
        container.parentNode.removeChild(container);
      }
      return Promise.reject("Failed to create UdAlert instance");
    }

    const originalDestroy = instance.destroy;
    instance.destroy = (...args) => {
      try {
        originalDestroy?.(...args);
      } catch (error) {
        console.error("[UdAlert] Error in destroy:", error);
      }
      render(null, container);
      if (container.parentNode) {
        container.parentNode.removeChild(container);
      }
    };

    return instance.show?.() || Promise.resolve();
  } catch (error) {
    console.error("[UdAlert] Error creating alert:", error);
    return Promise.reject(error);
  }
};
export { udAlert };

// udLoading
const udLoading = {
  instance: null,
  container: null,
  open(options = {}) {
    try {
      // 如果已經有實例就先關掉，避免重複掛載
      if (this.instance) {
        this.close();
      }
      this.container = document.createElement("div");
      document.body.appendChild(this.container);

      const vnode = createVNode(UdLoading, options);
      render(vnode, this.container);

      this.instance = vnode.component?.proxy;

      if (!this.instance) {
        console.error("[UdLoading] Failed to create instance");
        this.close();
      }
    } catch (error) {
      console.error("[UdLoading] Error opening loading:", error);
      this.close();
    }
  },
  close() {
    try {
      if (this.container) {
        render(null, this.container);
        if (this.container.parentNode) {
          this.container.parentNode.removeChild(this.container);
        }
        this.container = null;
        this.instance = null;
      }
    } catch (error) {
      console.error("[UdLoading] Error closing loading:", error);
      // 強制清理
      this.container = null;
      this.instance = null;
    }
  }
};
export { udLoading };

// ud-ui插件註冊方法
const install = app => {
  try {
    // 註冊工具函數
    if (udUtils && typeof udUtils === "object") {
      Object.keys(udUtils).forEach(item => {
        if (udUtils[item] && typeof udUtils[item] === "function") {
          app.config.globalProperties[item] = udUtils[item];
        }
      });
    }

    // 註冊組件
    if (Array.isArray(udComponents)) {
      udComponents.forEach(item => {
        if (item && item.name) {
          app.component(item.name, item);
        }
      });
    }

    // 註冊全局屬性
    app.config.globalProperties.udAxios = udAxios;
    app.config.globalProperties.udAlert = udAlert;
    app.config.globalProperties.udLoading = udLoading;
  } catch (error) {
    console.error("[UdUI] Error during installation:", error);
  }
};

export default install;
