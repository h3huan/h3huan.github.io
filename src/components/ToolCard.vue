<template>
    <div class="tool-card">
      <div class="tool-icon">
        <!-- 这里放置图标，目前用符号代替 -->
        {{ icon }}
      </div>
      <div class="tool-title">{{ title }}</div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { defineProps } from 'vue';
  
  const props = defineProps<{
    icon: string; // 图标符号或类名
    title: string; // 工具标题文本
  }>();
  </script>
  
  <style scoped>
  .tool-card {
    background-color: var(--color-background-card);
    border: 1px solid var(--color-border);
    border-radius: 8px; /* 小圆角 */
    padding: 20px;
    display: flex;
    flex-direction: column; /* 垂直布局图标和文字 */
    align-items: center; /* 居中对齐 */
    text-align: center;
    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out; /* 平滑过渡 */
    cursor: pointer; /* 鼠标悬停变手势 */
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03); /* 默认阴影 */
  }
  
  .tool-card:hover {
    transform: translateY(-4px); /* 向上轻微移动 */
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08); /* 更明显的阴影 */
  }
  
  .tool-icon {
    font-size: 36px; /* 图标大小 */
    margin-bottom: 10px;
    color: var(--color-accent); /* 使用强调色 */
  }
  
  .tool-title {
    font-size: 18px;
    font-weight: 500; /* Medium */
    color: var(--color-text-primary);
  }
  </style>