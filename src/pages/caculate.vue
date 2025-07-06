<template>
  <div class="calculator-wrapper">
    <div class="calculator-card">
      
      <header class="calculator-header">
        <h1>日常开支计算器</h1>
        <p>轻松记录和计算您的每一笔花费</p>
      </header>

      <div class="input-group">
        <label for="budget-input">总预算:</label>
        <div class="input-container">
          <span>¥</span>
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
          <input 
            type="checkbox" 
            v-model="item.enabled"
            class="item-toggle"
          >
          <input 
            type="text" 
            v-model="item.name"
            :disabled="!item.enabled"
            class="item-description"
            placeholder="费用说明 (例如: 咖啡)"
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
          <button @click="removeItem(item.id)" class="item-remove-btn" title="删除项目">
            ✕
          </button>
        </div>
      </transition-group>

      <button @click="addItem" class="add-item-btn">
        ＋ 增加一个新项目
      </button>

      <hr class="separator">

      <div class="summary-panel">
        <div class="summary-row">
          <span class="summary-label">总计:</span>
          <span class="summary-value total-amount">¥ {{ totalAmount.toFixed(2) }}</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">剩余预算:</span>
          <span 
            class="summary-value remaining-amount"
            :class="remainingAmount < 0 ? 'is-negative' : 'is-positive'"
          >
            ¥ {{ remainingAmount.toFixed(2) }}
          </span>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

// 定义项目的数据结构接口
interface Item {
  id: string;
  name: string;
  amount: number | null;
  enabled: boolean;
}

// 使用 ref 创建响应式数据
const budget = ref<number | null>(null);
const items = ref<Item[]>([
  // 初始数据
  { id: crypto.randomUUID(), name: '午餐', amount: 25, enabled: true },
  { id: crypto.randomUUID(), name: '地铁通勤', amount: 8, enabled: true },
  { id: crypto.randomUUID(), name: '电影票', amount: 50, enabled: false },
]);

// 计算总开销
const totalAmount = computed(() => {
  return items.value
    .filter(item => item.enabled) // 只计算启用的项目
    .reduce((total, item) => total + (Number(item.amount) || 0), 0);
});

// 计算剩余预算
const remainingAmount = computed(() => {
  const budgetValue = Number(budget.value) || 0;
  return budgetValue - totalAmount.value;
});

// 方法：增加一个新项目
const addItem = () => {
  items.value.push({
    id: crypto.randomUUID(),
    name: '',
    amount: null,
    enabled: true,
  });
};

// 方法：根据ID移除一个项目
const removeItem = (id: string) => {
  items.value = items.value.filter(item => item.id !== id);
};
</script>


<style scoped>
/* 定义颜色和样式的变量，方便统一修改 */
:root {
  --color-bg: #f1f5f9;
  --color-card-bg: #ffffff;
  --color-text-primary: #1e293b;
  --color-text-secondary: #64748b;
  --color-border: #cbd5e1;
  --color-accent: #3b82f6;
  --color-accent-dark: #2563eb;
  --color-danger: #ef4444;
  --color-danger-dark: #dc2626;
  --color-success: #16a34a;
  --font-main: 'Inter', 'Noto Sans SC', sans-serif;
}

.calculator-wrapper {
  background-color: var(--color-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 1.5rem;
  font-family: var(--font-main);
}

.calculator-card {
  width: 100%;
  max-width: 680px;
  background-color: var(--color-card-bg);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border-radius: 16px;
  padding: 2.5rem;
}

.calculator-header {
  text-align: center;
  margin-bottom: 2rem;
}

.calculator-header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-text-primary);
}

.calculator-header p {
  color: var(--color-text-secondary);
  margin-top: 0.5rem;
}

.input-group {
  margin-bottom: 2rem;
}

.input-group label {
  display: block;
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--color-text-primary);
  margin-bottom: 0.75rem;
}

.input-container {
  position: relative;
}

.input-container span {
  position: absolute;
  top: 50%;
  left: 1rem;
  transform: translateY(-50%);
  color: var(--color-text-secondary);
  font-size: 1rem;
}

/* 通用输入框样式 */
input[type="number"],
input[type="text"] {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.input-container input {
  padding-left: 2.5rem;
}

input:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
  border-color: var(--color-accent);
}

/* 项目列表 */
.item-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.item-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: opacity 0.3s ease;
}

.item-toggle {
  flex-shrink: 0;
  width: 1.15rem;
  height: 1.15rem;
  cursor: pointer;
  accent-color: var(--color-danger);
}

.item-description {
  flex-grow: 1; /* 占据剩余空间 */
}

.item-amount {
  width: 120px;
}

.item-remove-btn {
  flex-shrink: 0;
  background-color: #f8fafc;
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
  border-radius: 50%;
  width: 32px;
  height: 32px;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s, color 0.2s, border-color 0.2s;
}

.item-remove-btn:hover {
  background-color: var(--color-danger);
  color: white;
  border-color: var(--color-danger);
}

/* 禁用状态 */
.item-row.is-disabled {
  opacity: 0.5;
}

.item-row.is-disabled .item-description {
  text-decoration: line-through;
}

/* 添加按钮 */
.add-item-btn {
  margin-top: 1.5rem;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background-color: var(--color-accent);
  color: white;
  font-weight: 500;
  padding: 0.8rem 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s;
}

.add-item-btn:hover {
  background-color: var(--color-accent-dark);
}

/* 分割线 */
.separator {
  margin: 2rem 0;
  border: none;
  border-top: 1px solid #e2e8f0;
}

/* 结果面板 */
.summary-panel {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.summary-label {
  font-size: 1.1rem;
  color: var(--color-text-primary);
}

.summary-value {
  font-weight: 700;
}

.total-amount {
  font-size: 1.75rem;
  color: var(--color-accent);
}

.remaining-amount {
  font-size: 1.5rem;
}

.remaining-amount.is-positive {
  color: var(--color-success);
}

.remaining-amount.is-negative {
  color: var(--color-danger);
}

/* 列表过渡动画 */
.list-enter-active,
.list-leave-active {
  transition: all 0.4s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>