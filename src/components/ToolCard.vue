<template>
  <router-link :to="url" class="tool-card-link">
    <div class="tool-card">
      <div class="tool-icon">
        {{ icon }}
      </div>
      <div class="tool-title">{{ title }}</div>
    </div>
  </router-link>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps<{
  icon: string;
  title: string;
  url: string; // <-- 增加 url prop，用于接收跳转路径
}>();
</script>

<style scoped>
/* 样式保持不变 */
.tool-card-link {
  text-decoration: none;
  color: inherit;
  display: block;
}
.tool-card {
  background-color: var(--color-background-card);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
}
.tool-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
}
.tool-icon {
  font-size: 36px;
  margin-bottom: 10px;
  color: var(--color-accent);
}
.tool-title {
  font-size: 18px;
  font-weight: 500;
  color: var(--color-text-primary);
}
</style>