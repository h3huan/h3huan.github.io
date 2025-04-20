import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// 删除: import vueI18n from '@intlify/unplugin-vue-i18n/vite'
// 删除: import path from 'node:path' // 如果 path 只用于 i18n include，也可以删除

// https://vitejs.dev/config/
export default defineConfig({
  base:'/tool_game_site/',
  plugins: [
    vue(),
    // 删除整个 vueI18n 插件的配置块
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})