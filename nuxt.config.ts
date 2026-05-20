// nuxt.config.ts
export default defineNuxtConfig({
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      titleTemplate: '%s – Toool',
      title: '施工中',
      htmlAttrs: { lang: 'zh-CN' },
      meta: [
        { name: 'google-site-verification', content: '2BaYC3W4-flE5M8oCdM-y0E9UP8sPGXuAceqx7rvfFc' },
        { property: 'og:type',      content: 'website' },
        { property: 'og:site_name', content: 'Toool' },
        { name: 'twitter:card',     content: 'summary' },
      ],
    },
    baseURL: '/',
    buildAssetsDir: '/assets/',
  },

  dir: {
    pages: 'src/pages',
    plugins: 'src/plugins',
    assets: 'src/assets',
  },

  components: [
    { path: '~/src/components', pathPrefix: false }
  ],

  devtools: { enabled: true },

  // nuxt-site-config — 被 sitemap / robots 模块共同读取
  site: {
    url: 'https://h3huan.github.io',
    name: 'Toool',
    description: '没有半点帮助的小工具集合，在线使用，无需安装',
    defaultLocale: 'zh-CN',
  },

  // 强制 Nitro 在 nuxi generate 时预渲染这两个动态服务路由
  // 缺少这一步会导致 GitHub Pages 找不到文件、回退到 HTML 404 页面，
  // 进而使 Content-Type 变为 text/html 而非 application/xml
  nitro: {
    prerender: {
      routes: ['/sitemap.xml', '/robots.txt'],
      crawlLinks: true,
    },
  },

  sitemap: {
    autoLastmod: true,
    xsl: false,
    urls: [
      { loc: '/',                priority: 1.0, changefreq: 'weekly'  },
      { loc: '/caculate',        priority: 0.8, changefreq: 'monthly' },
      { loc: '/comma-separator', priority: 0.8, changefreq: 'monthly' },
      { loc: '/md-excel',        priority: 0.8, changefreq: 'monthly' },
      { loc: '/currency',        priority: 0.8, changefreq: 'daily'   }, 
      { loc: '/function-plot',   priority: 0.8, changefreq: 'monthly' },
    ],
  },

  modules: [
    '@nuxtjs/sitemap',
    'nuxt-simple-robots',
    'nuxt-gtag',
  ],

  gtag: {
    id: 'G-FDSWGE6LGS',
  },
})