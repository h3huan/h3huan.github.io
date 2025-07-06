<template>
  <div id="app-container">
    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
// 现在这里通常是空的，或者只处理非常全局的逻辑
</script>

<style>
/* 建议将全局样式放在一个单独的文件中，如 assets/main.css */
/* 这里可以保留一些应用根级别的样式 */
#app-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: sans-serif;
}
</style>