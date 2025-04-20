<template>
  <div class="container">
    
    <h1>{{ $t('没有半点帮助的杂物箱（正在施工🚸）') }}</h1>

    <h2>{{ $t('格式处理') }}</h2>

    <div class="tool-list">
      <ToolCard
        v-for="tool in tools"
        :key="tool.id"
        :icon="tool.icon"
        :title="$t(tool.titleKey)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">

import ToolCard from './components/ToolCard.vue';
import { ref } from 'vue';

// 定义工具数据结构 (可选，配合 types/tools.ts)
// interface Tool {
//   id: string;
//   icon: string; // 图标，可以是符号或类名
//   titleKey: string; // 对应语言文件中的 key
// }

// 示例工具数据
const tools = ref([
  { id: 'tool1', icon: '🎨', titleKey: 'tools.tool1.title' },
  { id: 'tool2', icon: '⏰', titleKey: 'tools.tool2.title' },
  { id: 'tool3', icon: '📄', titleKey: 'tools.tool3.title' },
  { id: 'tool4', icon: '📝', titleKey: 'tools.tool4.title' },
  { id: 'tool5', icon: '📱', titleKey: 'tools.tool5.title' },
]);

// 如果需要更专业的图标，可以在这里引入图标库并在上面的 icon 字段中使用类名
// 例如，如果使用 feather-icons: <i :data-feather="tool.icon"></i> 并在 mounted 时 feather.replace()
</script>

<style scoped>
/* App.vue 的局部样式 */
.tool-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); /* 响应式网格，最小宽度180px */
  gap: 20px; /* 网格间距 */
  margin-top: 20px;
}

/* 容器样式已在 global.css 中定义，这里可以省略，或添加 App 根元素的特定样式 */
/* .container {} */
</style>