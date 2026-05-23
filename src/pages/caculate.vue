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

        <!-- Budget -->
        <div class="budget-block">
          <label class="field-label" for="budget-input">总预算</label>
          <div class="field-wrap">
            <span class="field-prefix">¥</span>
            <input
              type="number"
              id="budget-input"
              v-model.number="budget"
              placeholder="输入总预算"
              min="0"
              step="0.01"
              class="field-input"
            />
          </div>
        </div>

        <!-- Item list -->
        <transition-group name="list" tag="ul" class="item-list">
          <li
            v-for="item in items"
            :key="item.id"
            class="item-card"
            :class="{ 'is-disabled': !item.enabled }"
          >
            <input type="checkbox" v-model="item.enabled" class="item-check" />
            <div class="item-content">
              <input
                type="text"
                v-model="item.name"
                :disabled="!item.enabled"
                class="item-name"
                placeholder="费用说明（如：咖啡）"
              />
              <div class="item-bottom">
                <div class="field-wrap amount-wrap">
                  <span class="field-prefix">¥</span>
                  <input
                    type="number"
                    v-model.number="item.amount"
                    :disabled="!item.enabled"
                    class="field-input item-amount"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
                <button
                  @click="removeItem(item.id)"
                  class="item-remove"
                  title="删除"
                >
                  ✕
                </button>
              </div>
            </div>
          </li>
        </transition-group>

        <button @click="addItem" class="add-btn">＋ 增加项目</button>

        <!-- Summary -->
        <div class="summary">
          <div class="summary-row">
            <span class="summary-label">合计</span>
            <span class="summary-value">¥ {{ totalAmount.toFixed(2) }}</span>
          </div>
          <div v-if="budget" class="summary-row">
            <span class="summary-label">剩余预算</span>
            <span
              class="summary-value"
              :class="remainingAmount < 0 ? 'is-neg' : 'is-pos'"
            >
              ¥ {{ remainingAmount.toFixed(2) }}
            </span>
          </div>
        </div>
      </div>

      <!-- 工具说明 -->
      <article class="tool-desc">
        <h2>关于日常开支计算器</h2>
        <p>
          轻量级在线预算跟踪工具，帮助你随时记录和核算日常开销，无需下载任何
          App，打开即用。适合旅行费用核算、聚餐均摊、月末账单整理等一次性临时计算场景。
        </p>
        <h3>使用方法</h3>
        <ol>
          <li>
            在顶部输入你的<strong>总预算</strong>（例如出行费用上限或月度预算）
          </li>
          <li>点击「＋ 增加项目」逐条添加每笔支出，填写名称和金额</li>
          <li>
            通过复选框临时排除某项，底部实时显示合计与剩余预算；红色表示超支
          </li>
        </ol>
        <h3>适用场景</h3>
        <p>
          旅行前预估各项花费是否超出预算；聚餐时快速合计人均份额；月底对账时逐项核查账单；临时估算采购清单的总金额。工具完全运行在浏览器本地，数据不会上传，关闭页面后自动清空。
        </p>
      </article>

      <!-- 相关工具 -->
      <nav class="related-tools">
        <p class="related-title">相关工具</p>
        <div class="related-links">
          <NuxtLink to="/currency" class="related-link">💱 汇率计算器</NuxtLink>
          <NuxtLink to="/function-plot" class="related-link"
            >📈 函数绘图器</NuxtLink
          >
          <NuxtLink to="/comma-separator" class="related-link"
            >✂️ 逗号分隔器</NuxtLink
          >
        </div>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

useSeoMeta({
  title: "日常开支计算器",
  ogTitle: "日常开支计算器 – Toool",
  description: "懒人账单，快捷记账，在线预算，简易出入账估算计算器",
  ogDescription: "懒人账单，快捷记账，在线预算，简易出入账估算计算器",
});

interface Item {
  id: string;
  name: string;
  amount: number | null;
  enabled: boolean;
}

const budget = ref<number | null>(null);
const items = ref<Item[]>([
  { id: crypto.randomUUID(), name: "午餐", amount: 25, enabled: true },
  { id: crypto.randomUUID(), name: "地铁通勤", amount: 8, enabled: true },
  { id: crypto.randomUUID(), name: "电影票", amount: 50, enabled: false },
]);

const totalAmount = computed(() =>
  items.value
    .filter((i) => i.enabled)
    .reduce((sum, i) => sum + (Number(i.amount) || 0), 0)
);

const remainingAmount = computed(
  () => (Number(budget.value) || 0) - totalAmount.value
);

const addItem = () => {
  items.value.push({
    id: crypto.randomUUID(),
    name: "",
    amount: null,
    enabled: true,
  });
};

const removeItem = (id: string) => {
  items.value = items.value.filter((i) => i.id !== id);
};
</script>

<style scoped>
/* ── Page shell ───────────────────────────────────────── */
.tool-page {
  padding: 1.5rem var(--page-pad, 1rem) 3rem;
}
.tool-page-inner {
  max-width: 560px;
  margin: 0 auto;
}

/* ── Back link ────────────────────────────────────────── */
.tool-back {
  margin-bottom: 1.25rem;
}
.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--c-text-2);
  padding: 0.3rem 0.75rem;
  border-radius: var(--r-md);
  border: 1px solid var(--c-border);
  background: var(--c-surface);
  transition: color 0.15s, background 0.15s, border-color 0.15s;
  text-decoration: none;
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
  padding: 1.75rem 1.5rem;
  box-shadow: var(--shadow-sm);
}

/* ── Header ───────────────────────────────────────────── */
.tool-header {
  text-align: center;
  margin-bottom: 1.5rem;
}
.tool-header h1 {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--c-text-1);
  letter-spacing: -0.02em;
  margin-bottom: 0.3rem;
}
.tool-header p {
  font-size: 0.9rem;
  color: var(--c-text-2);
}

/* ── Budget block ─────────────────────────────────────── */
.budget-block {
  margin-bottom: 1.5rem;
}
.field-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--c-text-1);
  margin-bottom: 0.45rem;
}

/* ── Shared field ─────────────────────────────────────── */
.field-wrap {
  position: relative;
  display: flex;
  align-items: center;
}
.field-prefix {
  position: absolute;
  left: 0.8rem;
  color: var(--c-text-3);
  font-size: 1rem;
  pointer-events: none;
  user-select: none;
}
.field-input {
  width: 100%;
  padding: 0.7rem 0.75rem 0.7rem 2rem;
  border: 1px solid var(--c-border);
  border-radius: var(--r-md);
  font-size: 1rem;
  font-family: inherit;
  color: var(--c-text-1);
  background: var(--c-surface);
  transition: border-color 0.15s, box-shadow 0.15s;
  outline: none;
  appearance: textfield;
  -moz-appearance: textfield;
}
.field-input::-webkit-outer-spin-button,
.field-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
.field-input:focus {
  border-color: var(--c-accent);
  box-shadow: 0 0 0 3px var(--c-accent-bg);
}
.field-input:disabled {
  background: var(--c-surface-2);
  color: var(--c-text-3);
}

/* ── Item list ────────────────────────────────────────── */
.item-list {
  list-style: none;
  padding: 0;
  margin: 0 0 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

/* ── Item card ────────────────────────────────────────── */
.item-card {
  display: flex;
  align-items: flex-start;
  gap: 0.65rem;
  padding: 0.75rem;
  border: 1px solid var(--c-border);
  border-radius: var(--r-md);
  background: var(--c-surface);
  transition: opacity 0.2s, border-color 0.2s;
}
.item-card.is-disabled {
  opacity: 0.45;
}
.item-card.is-disabled .item-name {
  text-decoration: line-through;
}

.item-check {
  flex-shrink: 0;
  width: 1.1rem;
  height: 1.1rem;
  margin-top: 0.65rem;
  accent-color: var(--c-accent);
  cursor: pointer;
}

.item-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.item-name {
  width: 100%;
  padding: 0.55rem 0.7rem;
  border: 1px solid var(--c-border);
  border-radius: var(--r-md);
  font-size: 1rem;
  font-family: inherit;
  color: var(--c-text-1);
  background: var(--c-surface);
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
  box-sizing: border-box;
}
.item-name:focus {
  border-color: var(--c-accent);
  box-shadow: 0 0 0 3px var(--c-accent-bg);
}
.item-name:disabled {
  background: var(--c-surface-2);
  color: var(--c-text-3);
}

/* ── Item bottom row: amount + remove ─────────────────── */
.item-bottom {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.amount-wrap {
  flex: 1;
  min-width: 0;
}
.item-amount {
  font-size: 1rem;
}

.item-remove {
  flex-shrink: 0;
  width: 2rem;
  height: 2rem;
  background: transparent;
  color: var(--c-text-3);
  border: 1px solid var(--c-border);
  border-radius: var(--r-md);
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
}
.item-remove:hover {
  background: var(--c-danger-bg);
  color: var(--c-danger);
  border-color: var(--c-danger);
}

/* ── Add button ───────────────────────────────────────── */
.add-btn {
  width: 100%;
  padding: 0.7rem 1rem;
  background: var(--c-accent-bg);
  color: var(--c-accent);
  border: 1px solid var(--c-accent-muted);
  border-radius: var(--r-md);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s, color 0.15s;
  margin-bottom: 1.25rem;
}
.add-btn:hover {
  background: var(--c-accent);
  color: #fff;
  border-color: var(--c-accent);
}

/* ── Summary ──────────────────────────────────────────── */
.summary {
  border-top: 1px solid var(--c-border);
  padding-top: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}
.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}
.summary-label {
  font-size: 1rem;
  color: var(--c-text-2);
  font-weight: 500;
}
.summary-value {
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--c-accent);
}
.is-pos {
  color: var(--c-success);
}
.is-neg {
  color: var(--c-danger);
}

/* ── List animation ───────────────────────────────────── */
.list-enter-active,
.list-leave-active {
  transition: opacity 0.25s, transform 0.25s;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* ── Description / related ────────────────────────────── */
.tool-desc {
  margin-top: 2rem;
  font-size: 0.9rem;
  color: var(--c-text-2);
  line-height: 1.7;
}
.tool-desc h2 {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--c-text-1);
  margin-bottom: 0.5rem;
}
.tool-desc h3 {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--c-text-1);
  margin: 1rem 0 0.4rem;
}
.tool-desc ol {
  padding-left: 1.25rem;
}
.tool-desc li {
  margin-bottom: 0.3rem;
}

.related-tools {
  margin-top: 1.75rem;
}
.related-title {
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--c-text-3);
  margin-bottom: 0.6rem;
}
.related-links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.related-link {
  font-size: 0.875rem;
  padding: 0.3rem 0.75rem;
  border: 1px solid var(--c-border);
  border-radius: var(--r-md);
  color: var(--c-text-2);
  background: var(--c-surface);
  text-decoration: none;
  transition: color 0.15s, border-color 0.15s, background 0.15s;
}
.related-link:hover {
  color: var(--c-accent);
  border-color: var(--c-accent-muted);
  background: var(--c-accent-bg);
}
</style>
