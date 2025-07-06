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
  // 将 "简易算帐" 的 url 指向我们在路由中定义的路径
  { id: 'tool1', icon: '📄', titleKey: '简易算帐', url: '/caculate' }, // <-- 修改这里
  { id: 'tool2', icon: '⏰', titleKey: 'tools.tool2.title', url: '' }, // 示例
  { id: 'tool3', icon: '📄', titleKey: 'tools.tool3.title', url: '' },
  { id: 'tool4', icon: '📝', titleKey: 'tools.tool4.title', url: '' },
  { id: 'tool5', icon: '📱', titleKey: 'tools.tool5.title', url: '' },
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