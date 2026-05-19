<template>
  <div class="container">
    <h1>{{ '没有半点帮助的杂物箱（正在施工）' }}</h1>
    <h2>{{ '格式处理' }}</h2>
    <div class="tool-list">
      <ToolCard
        v-for="tool in tools"
        :key="tool.id"
        :icon="tool.icon"
        :title="tool.titleKey"
        :url="tool.url"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import ToolCard from '../components/ToolCard.vue';
import { ref } from 'vue';
useSeoMeta({
  title: '杂货箱',
  description: '通过此页面联系我们，获取支持。',
  ogTitle: '联系方式 - 我的网站', // Open Graph 标题，用于社交分享
  // ... 其他SEO相关的 meta 标签
})

const tools = ref([
  { id: 'tool1', icon: '🧾', titleKey: '简易算帐', url: '/caculate' },
  { id: 'tool2', icon: '✂️', titleKey: '逗号分隔器', url: '/comma-separator' },
  { id: 'tool3', icon: '📊', titleKey: 'Markdown ↔ Excel', url: '/md-excel' },
  { id: 'tool4', icon: '📝', titleKey: '(施工中)', url: '' },
  { id: 'tool5', icon: '📱', titleKey: '(施工中)', url: '' },
]);
</script>

<style scoped>
.tool-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px;
  margin-top: 20px;
}
</style>