// nuxt.config.ts
export default defineNuxtConfig({
  // 对于本地开发或部署到根目录，baseURL 应为 '/'
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      titleTemplate: '%s - Toool', // %s 会被页面标题替换
      title: '施工中', // 默认标题
      meta: [
        { name: 'google-site-verification', content: 'pmvDj44iSfn-8rbSAyNAo9sXYd1nEJquRW-ptRoRbvc' }
      ]},
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

  devtools: { enabled: true },
  modules: [
    '@nuxtjs/sitemap',
    'nuxt-simple-robots',
    'nuxt-gtag',
  ],
  gtag: {
    id: 'G-FDSWGE6LGS' // 替换成你的 GA4 ID
  }
  

})