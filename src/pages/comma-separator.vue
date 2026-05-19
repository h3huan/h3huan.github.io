<template>
  <div class="tool-wrapper">
    <div class="tool-card">

      <header class="tool-header">
        <h1>逗号分隔器</h1>
        <p>将多行文本快速转换为逗号分隔格式</p>
      </header>

      <div class="section">
        <label class="section-label">输入内容（每行一个）</label>
        <textarea
          v-model="inputText"
          class="main-textarea"
          placeholder="每行输入一个值，例如：&#10;苹果&#10;香蕉&#10;橙子"
          rows="8"
          spellcheck="false"
        ></textarea>
      </div>

      <div class="section options-section">
        <label class="section-label">输出格式</label>
        <div class="radio-group">
          <label class="radio-label" :class="{ active: mode === 'plain' }">
            <input type="radio" v-model="mode" value="plain">
            <span class="radio-text">逗号分隔</span>
            <code class="preview-code">a, b, c</code>
          </label>
          <label class="radio-label" :class="{ active: mode === 'quoted' }">
            <input type="radio" v-model="mode" value="quoted">
            <span class="radio-text">逗号单引号分隔</span>
            <code class="preview-code">'a', 'b', 'c'</code>
          </label>
        </div>
      </div>

      <div class="section">
        <div class="section-label-row">
          <label class="section-label">输出结果</label>
          <div class="meta-info">
            <span v-if="itemCount > 0" class="item-count">共 {{ itemCount }} 项</span>
            <button
              @click="copyResult"
              class="copy-btn"
              :class="{ success: copied }"
              :disabled="!outputText"
            >
              {{ copied ? '已复制 ✓' : '复制' }}
            </button>
          </div>
        </div>
        <textarea
          :value="outputText"
          readonly
          class="main-textarea output-textarea"
          rows="4"
          placeholder="转换结果将显示在这里..."
          spellcheck="false"
        ></textarea>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

useSeoMeta({
  title: '逗号分隔器',
  description: '将文本按行分割，快速转换为逗号分隔或逗号单引号分隔格式，适用于 SQL IN 查询等场景',
})

const inputText = ref('');
const mode = ref<'plain' | 'quoted'>('plain');
const copied = ref(false);

const lines = computed(() =>
  inputText.value
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 0)
);

const itemCount = computed(() => lines.value.length);

const outputText = computed(() => {
  if (lines.value.length === 0) return '';
  if (mode.value === 'plain') {
    return lines.value.join(', ');
  }
  return lines.value.map(l => `'${l}'`).join(', ');
});

const copyResult = async () => {
  if (!outputText.value) return;
  await navigator.clipboard.writeText(outputText.value);
  copied.value = true;
  setTimeout(() => { copied.value = false; }, 2000);
};
</script>

<style scoped>
.tool-wrapper {
  background-color: var(--color-bg, #f1f5f9);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem 1.5rem;
  font-family: 'Inter', 'Noto Sans SC', sans-serif;
}

.tool-card {
  width: 100%;
  max-width: 680px;
  background-color: #ffffff;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border-radius: 16px;
  padding: 2.5rem;
}

.tool-header {
  text-align: center;
  margin-bottom: 2rem;
}

.tool-header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.tool-header p {
  color: #64748b;
}

.section {
  margin-bottom: 1.75rem;
}

.section-label {
  display: block;
  font-size: 1rem;
  font-weight: 500;
  color: #1e293b;
  margin-bottom: 0.6rem;
}

.section-label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.6rem;
}

.meta-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.item-count {
  font-size: 0.875rem;
  color: #64748b;
}

.main-textarea {
  width: 100%;
  padding: 0.8rem 1rem;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 0.95rem;
  font-family: 'SF Mono', 'Fira Code', monospace;
  resize: vertical;
  transition: border-color 0.2s, box-shadow 0.2s;
  line-height: 1.6;
  color: #1e293b;
}

.main-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

.output-textarea {
  background-color: #f8fafc;
  color: #334155;
}

.options-section {
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 1.2rem 1.4rem;
}

.radio-group {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  cursor: pointer;
  padding: 0.6rem 0.8rem;
  border-radius: 8px;
  border: 1px solid transparent;
  transition: background-color 0.15s, border-color 0.15s;
}

.radio-label:hover {
  background-color: #eff6ff;
}

.radio-label.active {
  background-color: #eff6ff;
  border-color: #bfdbfe;
}

.radio-label input[type="radio"] {
  accent-color: #3b82f6;
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
}

.radio-text {
  font-size: 0.95rem;
  color: #334155;
  font-weight: 500;
}

.preview-code {
  margin-left: auto;
  background-color: #e2e8f0;
  color: #475569;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.85rem;
  font-family: 'SF Mono', 'Fira Code', monospace;
}

.copy-btn {
  padding: 0.35rem 0.9rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.copy-btn:hover:not(:disabled) {
  background-color: #2563eb;
}

.copy-btn:disabled {
  background-color: #cbd5e1;
  cursor: not-allowed;
}

.copy-btn.success {
  background-color: #16a34a;
}
</style>
