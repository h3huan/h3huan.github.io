<template>
  <div id="app-root">
    <header class="site-header">
      <div class="header-inner">
        <NuxtLink to="/" class="site-logo">
          <span class="logo-mark">🧰</span>
          <span class="logo-name">Toool</span>
        </NuxtLink>
        <nav class="site-nav">
          <NuxtLink to="/" class="nav-link" active-class="" exact-active-class="nav-link--active">主页</NuxtLink>
          <a href="/#tools" class="nav-link">工具</a>
          <a href="/#games" class="nav-link">游戏</a>
        </nav>
      </div>
    </header>

    <main class="site-main">
      <NuxtPage />
    </main>

    <footer class="site-footer">
      <div class="footer-inner">
        <span class="footer-brand">🧰 Toool</span>
        <span class="footer-copy">© 2025 · 没啥用的工具箱，正在施工中</span>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const canonical = computed(() => `https://toool.eu.cc${route.path}`)
useHead({
  link: [{ rel: 'canonical', href: canonical }],
  meta: [{ property: 'og:url', content: canonical }],
})
</script>

<style>
/* ── Global reset & base ────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { font-size: 16px; scroll-behavior: smooth; }
body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    'PingFang SC', 'Microsoft YaHei', sans-serif;
  background: var(--c-bg);
  color: var(--c-text-1);
  line-height: 1.65;
  -webkit-font-smoothing: antialiased;
  min-height: 100vh;
}
a { color: inherit; text-decoration: none; }
button { font-family: inherit; cursor: pointer; }
img { display: block; max-width: 100%; }

/* ── Design tokens ──────────────────────────────────── */
:root {
  --c-bg:          #f3f6fb;
  --c-surface:     #ffffff;
  --c-surface-2:   #f8fafc;
  --c-border:      #dde3ed;
  --c-border-hi:   #a5b4fc;

  --c-text-1:      #111827;
  --c-text-2:      #4b5563;
  --c-text-3:      #9ca3af;

  --c-accent:      #4361ee;
  --c-accent-dark: #3451d1;
  --c-accent-bg:   #eef2ff;
  --c-accent-muted:#c7d2fe;

  --c-success:     #059669;
  --c-success-bg:  #d1fae5;
  --c-danger:      #dc2626;
  --c-danger-bg:   #fee2e2;

  --r-sm:   6px;
  --r-md:   10px;
  --r-lg:   14px;
  --r-xl:   20px;

  --shadow-xs: 0 1px 3px rgba(0,0,0,0.06);
  --shadow-sm: 0 2px 8px rgba(0,0,0,0.07);
  --shadow-md: 0 6px 20px rgba(0,0,0,0.09);

  --page-max:  1260px;
  --page-pad:  1.5rem;
}

/* ── App shell ──────────────────────────────────────── */
#app-root {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.site-main { flex: 1; }
</style>

<style scoped>
/* ── Header ─────────────────────────────────────────── */
.site-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255,255,255,0.88);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-bottom: 1px solid var(--c-border);
}

.header-inner {
  max-width: var(--page-max);
  margin: 0 auto;
  padding: 0 var(--page-pad);
  height: 54px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.site-logo {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  font-weight: 700;
  font-size: 1.05rem;
  color: var(--c-text-1);
  letter-spacing: -0.02em;
  flex-shrink: 0;
}
.logo-mark { font-size: 1.2rem; line-height: 1; }

.site-nav {
  display: flex;
  align-items: center;
  gap: 0.15rem;
}

.nav-link {
  padding: 0.3rem 0.7rem;
  border-radius: var(--r-md);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--c-text-2);
  transition: color 0.15s, background 0.15s;
}
.nav-link:hover { color: var(--c-text-1); background: var(--c-surface-2); }
.nav-link--active { color: var(--c-accent); background: var(--c-accent-bg); }

/* ── Footer ─────────────────────────────────────────── */
.site-footer {
  border-top: 1px solid var(--c-border);
  background: var(--c-surface);
  padding: 1.1rem var(--page-pad);
}
.footer-inner {
  max-width: var(--page-max);
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}
.footer-brand { font-size: 0.875rem; font-weight: 600; color: var(--c-text-2); }
.footer-copy  { font-size: 0.8125rem; color: var(--c-text-3); }

/* ── Responsive ─────────────────────────────────────── */
@media (max-width: 480px) {
  .logo-name { display: none; }
  .nav-link  { padding: 0.3rem 0.5rem; font-size: 0.8125rem; }
}
</style>
