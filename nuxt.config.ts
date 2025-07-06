// nuxt.config.ts
export default defineNuxtConfig({
  // 对于本地开发或部署到根目录，baseURL 应为 '/'
  app: {
    baseURL: '/', 
    buildAssetsDir: '/assets/' // 推荐的静态资源目录
  },

  // 确保您的页面和组件目录被正确识别
  dir: {
    pages: 'src/pages',
    // components: 'src/components',
    plugins: 'src/plugins',
    assets: 'src/assets'
  },

  // 告诉 Nuxt 在哪里寻找 CSS 文件
//   css: ['@/assets/styles/global.css'],

  devtools: { enabled: true }
})