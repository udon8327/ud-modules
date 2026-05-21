/*
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

//-----------------------String-----------------------
/**
 * 將字串內換行符\n轉為<br>
 * @param {string} val 傳入值
 * @param {boolean} is_xhtml 是否為xhtml 預設為false
 * @example nl2br("Line1\nLine2") -> "Line1<br>Line2"
 */
const nl2br = (val = "", isXhtml = false) => {
  if (typeof val !== "string") return val;
  const breakTag = isXhtml ? "<br />" : "<br>";
  return val.replace(/(\r\n|\n\r|\r|\n)/g, breakTag);
};

/**
 * 取得隨機字串
 * @param {number} length 指定字串長度 預設為10
 */
const getRandomString = (length = 10) => {
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charsetLength = charset.length;
  let result = "";
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
      navigator.clipboard
        .writeText(text)
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
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.left = "-9999px";
      textarea.setAttribute("readonly", "true");
      document.body.appendChild(textarea);
      textarea.select();
      try {
        const successful = document.execCommand("copy");
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
const formatNumber = val => {
  if (val == null || isNaN(val)) return "";
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
const padStart = (val, length = 2, fillChar = "0") => {
  if (val == null) return "";
  return val.toString().padStart(length, fillChar.toString());
};

//-----------------------Image-----------------------
/**
 * 單張圖片載入完成
 * @param {string} url 圖片路徑
 * @example imageLoaded('imgUrl').then(...) -> 圖片讀取完成時返回該Image物件
 */
const imageLoaded = url => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const cleanup = () => {
      img.onload = null;
      img.onerror = null;
    };
    img.onload = () => {
      cleanup();
      resolve(img);
    };
    img.onerror = () => {
      cleanup();
      reject(new Error(`圖片載入失敗：${url}`));
    };
    img.src = url;
    if (img.complete) {
      cleanup();
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
  const loadImage = src =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = err => reject(new Error(`圖片載入失敗：${src}`));
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
const imageDownload = (selector, name = "下載圖片", type = "image/jpeg") => {
  const imgElement = document.querySelector(selector);
  if (!imgElement || !imgElement.src) {
    console.warn("無效的圖片元素或未設定 src。");
    return;
  }
  const image = new Image();
  image.crossOrigin = "anonymous"; // 避免跨域污染
  image.src = imgElement.src;
  image.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0);
    try {
      const url = canvas.toDataURL(type);
      const a = document.createElement("a");
      a.download = name;
      a.href = url;
      a.click(); // 觸發下載
    } catch (e) {
      // 若跨域造成安全限制，退而求其次直接開啟圖片來源
      console.warn("Canvas toDataURL 失敗，改為直接開啟圖片：", e);
      window.open(image.src, "_blank");
    }
  };
  image.onerror = () => {
    console.error("圖片載入失敗，可能因為跨域或圖片損毀。");
  };
};

//-----------------------Array-----------------------
/**
 * 陣列是否有重複值(不分型別)
 * @param {array} arr 傳入值
 * @example isArrayRepeat([1, 2, 2, 3]) -> true
 */
const isArrayRepeat = arr => {
  if (!Array.isArray(arr)) return false;
  return new Set(arr).size !== arr.length;
};

/**
 * 移除陣列中的重複元素
 * @param {array} arr 傳入值
 * @example removeArrayRepeat([1, 2, 2, 3]) -> [1, 2, 3]
 */
const removeArrayRepeat = arr => {
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
const typeOf = val => {
  return Object.prototype.toString.call(val).slice(8, -1).toLowerCase();
};

/**
 * 深拷貝
 * @param {object} obj 傳入值 要拷貝的資料
 * @param {WeakMap} hash 用於處理循環引用
 */
const deepClone = (obj, hash = new WeakMap()) => {
  if (obj === null || typeof obj !== "object") return obj;
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof RegExp) return new RegExp(obj.source, obj.flags);
  if (obj instanceof Error) {
    const err = new obj.constructor(obj.message);
    err.stack = obj.stack;
    return err;
  }
  if (obj instanceof Map) {
    const result = new Map();
    hash.set(obj, result);
    for (const [k, v] of obj.entries()) {
      const ck = deepClone(k, hash);
      const cv = deepClone(v, hash);
      result.set(ck, cv);
    }
    return result;
  }
  if (obj instanceof Set) {
    const result = new Set();
    hash.set(obj, result);
    for (const v of obj.values()) {
      result.add(deepClone(v, hash));
    }
    return result;
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
  for (const key of Object.keys(obj)) {
    const newKey = Object.prototype.hasOwnProperty.call(keys, key) ? keys[key] : key;
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
  if (isNaN(year) || isNaN(month) || isNaN(day) || month < 1 || month > 12 || day < 1) {
    return false;
  }
  const testDate = new Date(year, month - 1, day);
  return testDate.getFullYear() === year && testDate.getMonth() === month - 1 && testDate.getDate() === day;
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
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
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
    S: date.getMilliseconds() // 毫秒 (0-999)
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
  if (typeof el === "number") {
    targetTop = el + offset;
  } else if (el === "top") {
    targetTop = 0 + offset;
  } else if (el === "bottom") {
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
const getPageScroll = (type = "height") => {
  if (type === "width") {
    return window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0;
  }
  if (type === "height") {
    return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
  }
  throw new Error(`Invalid type: ${type}. Use "width" or "height".`);
};

/**
 * 取得頁面尺寸
 * @param {string} scope 範圍(view: 可視頁面, full: 完整頁面)
 */
const getPageSize = (scope = "view") => {
  const el = document.compatMode === "BackCompat" ? document.body : document.documentElement;
  if (scope === "view") {
    return [el.clientWidth, el.clientHeight];
  }
  if (scope === "full") {
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
  if (val == null) return val;
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
      return /^(?:(?!0000)[0-9]{4}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29)$/.test(
        val
      );
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
      let letters = new Array(
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "J",
        "K",
        "L",
        "M",
        "N",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
        "X",
        "Y",
        "W",
        "Z",
        "I",
        "O"
      );
      let multiply = new Array(1, 9, 8, 7, 6, 5, 4, 3, 2, 1);
      let nums = new Array(2);
      let firstChar;
      let firstNum;
      let lastNum;
      let total = 0;
      let regExpID = /^[a-z](1|2)\d{8}$/i;
      if (val.search(regExpID) == -1) {
        return false;
      } else {
        firstChar = val.charAt(0).toUpperCase();
        lastNum = val.charAt(9);
      }
      for (var i = 0; i < 26; i++) {
        if (firstChar == letters[i]) {
          firstNum = i + 10;
          nums[0] = Math.floor(firstNum / 10);
          nums[1] = firstNum - nums[0] * 10;
          break;
        }
      }
      for (var i = 0; i < multiply.length; i++) {
        if (i < 2) {
          total += nums[i] * multiply[i];
        } else {
          total += parseInt(val.charAt(i - 1)) * multiply[i];
        }
      }
      if (10 - (total % 10) != lastNum) {
        return false;
      }
      return true;
    // 正則表達式驗證
    default:
      let regexMode = new RegExp(type);
      return regexMode.test(val);
  }
};

/**
 * 精準數字驗證
 * @param {any} val 傳入值
 */
const isNumber = val => {
  return typeof val === "number" && !isNaN(val);
};

/**
 * 未填入驗證
 * @param {any} val 傳入值
 */
const isEmpty = val => {
  if (val === null || val === undefined) return true;
  if (typeof val === "string") return val.trim().length === 0;
  if (typeof val === "boolean") return !val;
  if (typeof val === "number") return false;
  if (Array.isArray(val)) return val.length === 0 || val.some(i => isEmpty(i));
  if (typeof val === "object") return Object.keys(val).length === 0;
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
};

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
};

/**
 * 查詢網址所帶參數
 * @param {string} query 指定查詢參數名稱，若不傳則回傳全部參數
 * @param {string} url 網址
 * @example queryString("id", "https://foo?id=123") -> "123"
 */
const queryString = (key, url) => {
  let targetUrl = url;
  if (!targetUrl) {
    if (typeof window === "undefined" || typeof location === "undefined") return key ? null : {};
    targetUrl = location.href;
  }
  const params = new URL(targetUrl).searchParams;
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
    apple: /iphone|ipod|ipad/i,
    android: /android/i,
    all: /iphone|ipod|ipad|android.*mobile|windows.*phone|blackberry.*mobile/i
  };
  if (os === "apple") return matchers.apple.test(ua);
  if (os === "android") return matchers.android.test(ua);
  return matchers.all.test(ua);
};

export {
  nl2br,
  getRandomString,
  copyText,
  getRandom,
  formatNumber,
  padStart,
  imageLoaded,
  imageAllLoaded,
  imageDownload,
  isArrayRepeat,
  removeArrayRepeat,
  indexOfAll,
  typeOf,
  deepClone,
  renameKeys,
  isExistDate,
  getDiffDate,
  formatTime,
  scrollToTarget,
  getPageScroll,
  getPageSize,
  isVerify,
  isNumber,
  isEmpty,
  debounce,
  throttle,
  queryString,
  isMobile
};
