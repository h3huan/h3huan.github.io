import { createApp } from 'vue';
import App from './App.vue';
import i18n from './i18n'; // 导入 i18n 配置
import router from './router'

import './assets/styles/global.css'; // 导入全局样式

const app = createApp(App);

app.use(i18n); // 使用 i18n 插件
app.use(router);

app.mount('#app');

// 初始化时设置 html 元素的 lang 属性
document.documentElement.lang = i18n.global.locale.value;