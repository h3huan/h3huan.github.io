<template>
  <div class="tool-page">

    <div class="tool-page-inner">
      <!-- Back nav -->
      <nav class="tool-back">
        <NuxtLink to="/" class="back-link">← 返回主页</NuxtLink>
      </nav>

      <!-- Tool card -->
      <div class="tool-card">

        <header class="tool-header">
          <h1>日常开支计算器</h1>
          <p>轻松记录和计算您的每一笔花费</p>
        </header>

        <div class="input-group">
          <label for="budget-input">总预算</label>
          <div class="input-prefix-wrap">
            <span class="input-prefix">¥</span>
            <input
              type="number"
              id="budget-input"
              v-model.number="budget"
              placeholder="输入您的总预算"
              min="0"
              step="0.01"
            >
          </div>
        </div>

        <transition-group name="list" tag="div" class="item-list">
          <div
            v-for="item in items"
            :key="item.id"
            class="item-row"
            :class="{ 'is-disabled': !item.enabled }"
          >
            <input type="checkbox" v-model="item.enabled" class="item-toggle">
            <input
              type="text"
              v-model="item.name"
              :disabled="!item.enabled"
              class="item-description"
              placeholder="费用说明（如：咖啡）"
            >
            <input
              type="number"
              v-model.number="item.amount"
              :disabled="!item.enabled"
              class="item-amount"
              placeholder="金额"
              min="0"
              step="0.01"
            >
            <button @click="removeItem(item.id)" class="item-remove" title="删除">✕</button>
          </div>
        </transition-group>

        <button @click="addItem" class="add-btn">＋ 增加一个项目</button>

        <hr class="divider">

        <div class="summary">
          <div class="summary-row">
            <span class="summary-label">总计</span>
            <span class="summary-value total">¥ {{ totalAmount.toFixed(2) }}</span>
          </div>
          <div class="summary-row">
            <span class="summary-label">剩余预算</span>
            <span class="summary-value remaining" :class="remainingAmount < 0 ? 'is-neg' : 'is-pos'">
              ¥ {{ remainingAmount.toFixed(2) }}
            </span>
          </div>
        </div>

      </div>

      <!-- 工具说明 -->
      <article class="tool-desc">
        <h2>关于日常开支计算器</h2>
        <p>轻量级在线预算跟踪工具，帮助你随时记录和核算日常开销，无需下载任何 App，打开即用。适合旅行费用核算、聚餐均摊、月末账单整理等一次性临时计算场景。</p>
        <h3>使用方法</h3>
        <ol>
          <li>在顶部输入你的<strong>总预算</strong>（例如出行费用上限或月度预算）</li>
          <li>点击「＋ 增加一个项目」逐条添加每笔支出，填写名称和金额</li>
          <li>通过复选框临时排除某项，底部实时显示合计与剩余预算；红色表示超支</li>
        </ol>
        <h3>适用场景</h3>
        <p>旅行前预估各项花费是否超出预算；聚餐时快速合计人均份额；月底对账时逐项核查账单；临时估算采购清单的总金额。工具完全运行在浏览器本地，数据不会上传，关闭页面后自动清空。</p>
      </article>

      <!-- 相关工具 -->
      <nav class="related-tools">
        <p class="related-title">相关工具</p>
        <div class="related-links">
          <NuxtLink to="/currency" class="related-link">💱 汇率计算器</NuxtLink>
          <NuxtLink to="/function-plot" class="related-link">📈 函数绘图器</NuxtLink>
          <NuxtLink to="/comma-separator" class="related-link">✂️ 逗号分隔器</NuxtLink>
        </div>
      </nav>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

useSeoMeta({
  title: '日常开支计算器',
  ogTitle: '日常开支计算器 – Toool',
  description: '懒人账单，快捷记账，在线预算，简易出入账估算计算器',
  ogDescription: '懒人账单，快捷记账，在线预算，简易出入账估算计算器',
})

interface Item {
  id: string;
  name: string;
  amount: number | null;
  enabled: boolean;
}

const budget = ref<number | null>(null);
const items  = ref<Item[]>([
  { id: crypto.randomUUID(), name: '午餐',   amount: 25, enabled: true  },
  { id: crypto.randomUUID(), name: '地铁通勤', amount: 8,  enabled: true  },
  { id: crypto.randomUUID(), name: '电影票',  amount: 50, enabled: false },
]);

const totalAmount = computed(() =>
  items.value
    .filter(i => i.enabled)
    .reduce((sum, i) => sum + (Number(i.amount) || 0), 0)
);

const remainingAmount = computed(() =>
  (Number(budget.value) || 0) - totalAmount.value
);

const addItem = () => {
  items.value.push({ id: crypto.randomUUID(), name: '', amount: null, enabled: true });
};

const removeItem = (id: string) => {
  items.value = items.value.filter(i => i.id !== id);
};
</script>

<style scoped>
/* ── Page shell ───────────────────────────────────────── */
.tool-page {
  padding: 1.5rem var(--page-pad) 3rem;
}
.tool-page-inner {
  max-width: 680px;
  margin: 0 auto;
}

/* ── Back link ────────────────────────────────────────── */
.tool-back { margin-bottom: 1.25rem; }
.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--c-text-2);
  padding: 0.3rem 0.7rem;
  border-radius: var(--r-md);
  border: 1px solid var(--c-border);
  background: var(--c-surface);
  transition: color 0.15s, background 0.15s, border-color 0.15s;
}
.back-link:hover {
  color: var(--c-accent);
  border-color: var(--c-accent-muted);
  background: var(--c-accent-bg);
}

/* ── Card ─────────────────────────────────────────────── */
.tool-card {
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: var(--r-xl);
  padding: 2rem 2rem 1.75rem;
  box-shadow: var(--shadow-sm);
}

/* ── Header ───────────────────────────────────────────── */
.tool-header {
  text-align: center;
  margin-bottom: 1.75rem;
}
.tool-header h1 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--c-text-1);
  letter-spacing: -0.02em;
  margin-bottom: 0.35rem;
}
.tool-header p { font-size: 0.9rem; color: var(--c-text-2); }

/* ── Budget input ─────────────────────────────────────── */
.input-group { margin-bottom: 1.5rem; }
.input-group label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--c-text-1);
  margin-bottom: 0.5rem;
}
.input-prefix-wrap { position: relative; }
.input-prefix {
  position: absolute;
  left: 0.9rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--c-text-3);
  font-size: 0.9rem;
  pointer-events: none;
}

/* ── Shared input styles ──────────────────────────────── */
input[type="number"],
input[type="text"] {
  width: 100%;
  padding: 0.65rem 0.8rem;
  border: 1px solid var(--c-border);
  border-radius: var(--r-md);
  font-size: 0.9rem;
  font-family: inherit;
  color: var(--c-text-1);
  background: var(--c-surface);
  transition: border-color 0.18s, box-shadow 0.18s;
  outline: none;
}
input[type="number"]:focus,
input[type="text"]:focus {
  border-color: var(--c-accent);
  box-shadow: 0 0 0 3px var(--c-accent-bg);
}
input:disabled {
  background: var(--c-surface-2);
  color: var(--c-text-3);
}
.input-prefix-wrap input { padding-left: 2.2rem; }

/* ── Item list ────────────────────────────────────────── */
.item-list {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  margin-bottom: 1rem;
}
.item-row {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  transition: opacity 0.25s;
}
.item-row.is-disabled { opacity: 0.45; }
.item-row.is-disabled .item-description { text-decoration: line-through; }

.item-toggle {
  flex-shrink: 0;
  width: 1.05rem;
  height: 1.05rem;
  accent-color: var(--c-accent);
  cursor: pointer;
}
.item-description { flex: 1; }
.item-amount      { width: 110px; flex-shrink: 0; }

.item-remove {
  flex-shrink: 0;
  width: 30px;
  height: 30px;
  background: var(--c-surface-2);
  color: var(--c-text-3);
  border: 1px solid var(--c-border);
  border-radius: 50%;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
}
.item-remove:hover {
  background: var(--c-danger-bg);
  color: var(--c-danger);
  border-color: var(--c-danger);
}

/* ── Add button ───────────────────────────────────────── */
.add-btn {
  margin-top: 0.35rem;
  width: 100%;
  padding: 0.65rem 1rem;
  background: var(--c-accent-bg);
  color: var(--c-accent);
  border: 1px solid var(--c-accent-muted);
  border-radius: var(--r-md);
  font-size: 0.9rem;
  font-weight: 600;
  transition: background 0.15s, border-color 0.15s;
}
.add-btn:hover { background: var(--c-accent); color: #fff; border-color: var(--c-accent); }

/* ── Divider ──────────────────────────────────────────── */
.divider { border: none; border-top: 1px solid var(--c-border); margin: 1.5rem 0; }

/* ── Summary ──────────────────────────────────────────── */
.summary { display: flex; flex-direction: column; gap: 0.75rem; }
.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}
.summary-label { font-size: 1rem; color: var(--c-text-2); font-weight: 500; }
.summary-value { font-weight: 700; }
.total         { font-size: 1.6rem; color: var(--c-accent); }
.remaining     { font-size: 1.4rem; }
.is-pos        { color: var(--c-success); }
.is-neg        { color: var(--c-danger);  }

/* ── List animation ───────────────────────────────────── */
.list-enter-active, .list-leave-active { transition: all 0.3s ease; }
.list-enter-from, .list-leave-to { opacity: 0; transform: translateX(-16px); }

/* ── Mobile ───────────────────────────────────────────── */
@media (max-width: 640px) {
  .tool-page { padding: 1rem var(--page-pad) 2rem; }
  .tool-card { padding: 1.25rem 1rem 1.25rem; border-radius: var(--r-lg); }
  .item-amount { width: 90px; }
}
</style>
