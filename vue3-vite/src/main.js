import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "./router";
import UdUi from "./components/ud-ui";
import mitt from "mitt";

import App from "./App.vue";
import "./style/all.sass";

const app = createApp(App);
app.config.globalProperties.$mitt = mitt();
app.use(createPinia()).use(router).use(UdUi).mount("#app");
