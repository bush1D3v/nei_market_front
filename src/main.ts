import "./assets/css/main.css";
import {createApp} from "vue";
import {createPinia} from "pinia";
import App from "./App.vue";
import router from "./router";
import i18n from "./locales/translator";
import vTranslate from "./config/directive/v-translate";
import {VueQueryPlugin} from "@tanstack/vue-query";

const app = createApp(App);

app.use(createPinia());
app.use(VueQueryPlugin, {
	enableDevtoolsV6Plugin: true,
});
app.use(router);

app.directive("translate", vTranslate);

i18n(app).mount("#app");
