let BASE_URL = "";
let LINE_LOGIN_CHANNEL_ID = "";
let LINE_OA_URL = "";
let LINE_LIFF_ID = "";

switch (location.hostname) {
    // 正式機
    case "ud-modules-2.udons.space":
        BASE_URL = "https://mock.udons.space";
        LINE_LOGIN_CHANNEL_ID = "1655285115";
        LINE_OA_URL = "https://line.me/R/ti/p/@524wuemo";
        LINE_LIFF_ID = "1655285115-w926gzYP";
        break;
    // 測試機、本機開發
    default:
        BASE_URL = "";
        // BASE_URL = location.hostname === "10.10.50.211" || location.hostname === "localhost"
        //     ? "" // 本機走 vite proxy（同源），避免 CORS
        //     : "https://lineproqa.lrp.com.tw";
        LINE_LOGIN_CHANNEL_ID = "1655285115";
        LINE_OA_URL = "https://line.me/R/ti/p/@524wuemo";
        LINE_LIFF_ID = "1655285115-AYjbLKMr";
        break;
}