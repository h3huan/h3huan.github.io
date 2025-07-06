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
        :url="tool.url"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import ToolCard from '../components/ToolCard.vue';
import { ref } from 'vue';

const tools = ref([
  // 将 "简易算帐" 的 url 指向我们在路由中定义的路径
  { id: 'tool1', icon: '📄', titleKey: '简易算帐', url: '/caculate' }, // <-- 修改这里
  { id: 'tool2', icon: '⏰', titleKey: 'tools.tool2.title', url: '/todo' }, // 示例
  { id: 'tool3', icon: '📄', titleKey: 'tools.tool3.title', url: '/todo' },
  { id: 'tool4', icon: '📝', titleKey: 'tools.tool4.title', url: '/todo' },
  { id: 'tool5', icon: '📱', titleKey: 'tools.tool5.title', url: '/todo' },
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