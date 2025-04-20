// src/i18n.ts
import { createI18n } from 'vue-i18n';

// 使用 Vite 的 glob 导入功能，结合 unplugin-vue-i18n 插件
// import.meta.glob 匹配 './locales/' 目录下所有 .ts 文件
// { eager: true } 表示同步导入 (打包时包含)
const messages = Object.fromEntries(
  Object.entries(
    import.meta.glob<{ default: any }>('./locales/*.ts', { eager: true })
  ).map(([key, value]) => {
    // key 的格式通常是 './locales/en.ts', './locales/zh.ts' 等
    // 我们需要从中提取 locale 名称 (en, zh)
    const locale = key.slice('./locales/'.length, key.lastIndexOf('.'));

    // value 是导入的模块对象，我们想要其 default 导出
    return [locale, value.default];
  })
);

const i18n = createI18n({
  locale: 'zh', // 默认语言
  fallbackLocale: 'en', // 回退语言
  messages: messages, // 将通过 glob 导入生成的 messages 对象传递给 i18n
  // 如果您使用的是 Composition API，建议设置legacy: false
  // legacy: false,
  globalInjection: true, // 使 $t 等全局可用
});

export default i18n;