import liff from "@line/liff";
import request from "@/services/ud-axios.js";
import { udAlert } from "@/components/ud-ui";

const liffLogin = callback => {
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
            // 檢查有無Token
            if (!sessionStorage.getItem("token")) {
              request({
                url: `/line-crm-main/api/frontend/v1/line-liff/token`,
                method: "post",
                data: {
                  id_token: liff.getIDToken()
                }
              })
                .then(res => {
                  sessionStorage.setItem("token", res.data.token);
                  callback();
                })
                .catch(() => {
                  udAlert("Token取得失敗，請稍後再試").then(() => location.reload());
                });
            } else {
              callback();
            }
          } else {
            sessionStorage.setItem("loginRedirectUrl", location.href);
            location.href = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${
              import.meta.env.VITE_APP_LINE_LOGIN_CHANNEL_ID
            }&redirect_uri=${encodeURIComponent(
              location.origin + "/cb-web"
            )}&scope=profile%20openid%20phone%20email&bot_prompt=aggressive&prompt=consent&state=${Date.now()}`;
          }
        })
        .catch(() => {
          sessionStorage.removeItem("token");
          liff.logout();
          location.reload();
        });
    })
    .catch(err => {
      udAlert(`[${err.code}] ${err.message}\nLIFF初始化失敗，請稍後再試`).then(() => location.reload());
    });
};

export { liffLogin };
