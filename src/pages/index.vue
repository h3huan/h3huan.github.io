<template>
  <div class="home">

    <!-- ── Hero ───────────────────────────────────────── -->
    <section class="hero">
      <div class="hero-inner">
        <p class="hero-kicker">🧰 Toool</p>
        <h1 class="hero-title">没有半点帮助的<br>杂物箱</h1>
        <p class="hero-sub">一堆闲着没事做的小工具，随时在线使用，无需安装</p>
        <a href="#tools" class="hero-cta">浏览工具 ↓</a>
      </div>
    </section>

    <!-- ── Tool sections ──────────────────────────────── -->
    <div class="page-body" id="tools">

      <!-- 文本 & 格式 -->
      <section class="tool-section">
        <div class="section-head">
          <span class="section-emoji">📝</span>
          <h2 class="section-title">文本 &amp; 格式</h2>
          <span class="section-count">{{ textTools.filter(t => t.url).length }} 个可用</span>
        </div>
        <div class="tool-grid">
          <ToolCard
            v-for="t in textTools"
            :key="t.id"
            :icon="t.icon"
            :title="t.title"
            :description="t.description"
            :url="t.url"
          />
        </div>
      </section>

      <!-- 计算 & 换算 -->
      <section class="tool-section">
        <div class="section-head">
          <span class="section-emoji">🧮</span>
          <h2 class="section-title">计算 &amp; 换算</h2>
          <span class="section-count">{{ calcTools.filter(t => t.url).length }} 个可用</span>
        </div>
        <div class="tool-grid">
          <ToolCard
            v-for="t in calcTools"
            :key="t.id"
            :icon="t.icon"
            :title="t.title"
            :description="t.description"
            :url="t.url"
          />
        </div>
      </section>

      <!-- 小游戏 & 趣味 -->
      <section class="tool-section games-section" id="games">
        <div class="section-head">
          <span class="section-emoji">🎮</span>
          <h2 class="section-title">小游戏 &amp; 趣味</h2>
          <span class="section-badge">即将上线</span>
        </div>
        <div class="games-grid">
          <div v-for="n in 5" :key="n" class="game-card">
            <span class="game-icon">🎲</span>
            <span class="game-label">敬请期待</span>
          </div>
        </div>
      </section>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ToolCard from '../components/ToolCard.vue'

useSeoMeta({
  title: '杂货箱',
  description: '没有半点帮助的小工具集合，在线使用，无需安装',
})

const textTools = ref([
  { id: 'comma-sep', icon: '✂️', title: '逗号分隔器', description: '多行文本转逗号/引号分隔格式', url: '/comma-separator' },
  { id: 'md-excel',  icon: '📊', title: 'Markdown ↔ Excel', description: '表格格式双向转换', url: '/md-excel' },
  { id: 'ph1', icon: '🔤', title: '施工中', description: '', url: '' },
  { id: 'ph2', icon: '📋', title: '施工中', description: '', url: '' },
  { id: 'ph3', icon: '🔗', title: '施工中', description: '', url: '' },
  { id: 'ph4', icon: '📄', title: '施工中', description: '', url: '' },
])

const calcTools = ref([
  { id: 'caculate',       icon: '🧾', title: '简易算帐',    description: '记录开支与预算，实时计算余额',          url: '/caculate'       },
  { id: 'currency',       icon: '💱', title: '汇率计算器',  description: '实时汇率，支持 20+ 主要货币',           url: '/currency'       },
  { id: 'function-plot',  icon: '📈', title: '函数绘图器',  description: '笛卡尔坐标系，支持 sin cos sqrt 等',    url: '/function-plot'  },
  { id: 'ph5', icon: '📐', title: '施工中', description: '', url: '' },
])
</script>

<style scoped>
/* ── Hero ─────────────────────────────────────────────── */
.hero {
  background: linear-gradient(160deg, #eef2ff 0%, #f3f6fb 55%, #f3f6fb 100%);
  border-bottom: 1px solid var(--c-border);
  padding: 4rem var(--page-pad) 3.5rem;
}

.hero-inner {
  max-width: 680px;
  margin: 0 auto;
  text-align: center;
}

.hero-kicker {
  display: inline-block;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--c-accent);
  background: var(--c-accent-bg);
  padding: 0.25rem 0.75rem;
  border-radius: 99px;
  border: 1px solid var(--c-accent-muted);
  margin-bottom: 1.25rem;
  letter-spacing: 0.02em;
}

.hero-title {
  font-size: clamp(1.75rem, 5vw, 2.75rem);
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: -0.03em;
  color: var(--c-text-1);
  margin-bottom: 1rem;
}

.hero-sub {
  font-size: 1.05rem;
  color: var(--c-text-2);
  line-height: 1.7;
  margin-bottom: 1.75rem;
}

.hero-cta {
  display: inline-block;
  padding: 0.6rem 1.4rem;
  background: var(--c-accent);
  color: #fff;
  border-radius: 99px;
  font-size: 0.9rem;
  font-weight: 600;
  transition: background 0.15s, transform 0.15s;
}
.hero-cta:hover { background: var(--c-accent-dark); transform: translateY(-1px); }

/* ── Page body ────────────────────────────────────────── */
.page-body {
  max-width: var(--page-max);
  margin: 0 auto;
  padding: 2.5rem var(--page-pad) 4rem;
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

/* ── Section ──────────────────────────────────────────── */
.section-head {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 1.1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--c-border);
}

.section-emoji { font-size: 1.25rem; line-height: 1; }

.section-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--c-text-1);
  letter-spacing: -0.01em;
}

.section-count {
  margin-left: auto;
  font-size: 0.78rem;
  color: var(--c-text-3);
  background: var(--c-surface-2);
  border: 1px solid var(--c-border);
  padding: 0.15rem 0.55rem;
  border-radius: 99px;
}

.section-badge {
  margin-left: auto;
  font-size: 0.75rem;
  font-weight: 600;
  color: #d97706;
  background: #fffbeb;
  border: 1px solid #fde68a;
  padding: 0.15rem 0.55rem;
  border-radius: 99px;
}

/* ── Tool grid ────────────────────────────────────────── */
.tool-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(175px, 1fr));
  gap: 0.85rem;
}

/* ── Games section ────────────────────────────────────── */
.games-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.85rem;
}

.game-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  padding: 2rem 1rem;
  background: var(--c-surface-2);
  border: 2px dashed var(--c-border);
  border-radius: var(--r-lg);
  min-height: 130px;
  opacity: 0.65;
}

.game-icon  { font-size: 2rem; line-height: 1; }
.game-label { font-size: 0.8125rem; color: var(--c-text-3); font-weight: 500; }

/* ── Responsive ───────────────────────────────────────── */
@media (max-width: 640px) {
  .hero { padding: 2.5rem var(--page-pad) 2rem; }
  .page-body { padding: 1.75rem var(--page-pad) 3rem; gap: 2rem; }
  .tool-grid  { grid-template-columns: repeat(2, 1fr); }
  .games-grid { grid-template-columns: repeat(2, 1fr); }
}
</style>
