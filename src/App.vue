<template>
  <div id="app-layout">
    <header class="main-header">
      <nav>
        <NuxtLink to="/">主页</NuxtLink>
        <NuxtLink to="/caculate">计算器</NuxtLink>
      </nav>
    </header>

    <main class="page-content">
      <NuxtPage />
    </main>

    <footer class="main-footer">
      <p>版权所有 © 2025 My Awesome App</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
// 这里可以放置全局的逻辑，例如监听屏幕尺寸变化等
</script>

<style scoped>
/* 这里是针对主布局的样式 */
#app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-header {
  padding: 1rem 2rem;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.main-header nav {
  display: flex;
  gap: 1.5rem;
}

.main-header a {
  text-decoration: none;
  color: #333;
  font-weight: 500;
}

.page-content {
  flex-grow: 1; /* 让主内容区域占据剩余空间 */
}

.main-footer {
  padding: 1rem 2rem;
  background-color: #343a40;
  color: white;
  text-align: center;
  margin-top: auto; /* 确保页脚始终在底部 */
}
</style>