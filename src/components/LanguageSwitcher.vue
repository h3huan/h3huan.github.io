<template>
    <div class="language-switcher">
      <button
        @click="switchLanguage('zh')"
        :class="{ active: currentLocale === 'zh' }"
      >
        {{ $t('language.zh') }}
      </button>
      <span>|</span>
      <button
        @click="switchLanguage('en')"
        :class="{ active: currentLocale === 'en' }"
      >
        {{ $t('language.en') }}
      </button>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useI18n } from 'vue-i18n';
  import { computed } from 'vue';
  
  const { locale } = useI18n();
  
  const currentLocale = computed(() => locale.value);
  
  const switchLanguage = (lang: 'zh' | 'en') => {
    locale.value = lang;
    // 同时更新 html 元素的 lang 属性，以便 :lang() 伪类生效
    document.documentElement.lang = lang;
  };
  </script>
  
  <style scoped>
  .language-switcher {
    text-align: right;
    margin-bottom: 20px;
    font-size: 14px;
    color: var(--color-text-secondary); /* 浅灰色文字 */
  }
  
  .language-switcher button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 5px 8px;
    color: var(--color-text-secondary);
    font-size: 14px;
    transition: color 0.2s ease;
  }
  
  .language-switcher button:hover {
    color: var(--color-text-primary); /* 悬停时变深 */
  }
  
  .language-switcher button.active {
    color: var(--color-text-primary); /* 当前语言加深 */
    font-weight: 600;
  }
  
  .language-switcher span {
      margin: 0 5px;
      color: var(--color-border); /* 分隔符颜色 */
  }
  </style>