<template>
  <div class="tool-page">
    <div class="tool-page-inner">
      <nav class="tool-back">
        <NuxtLink to="/" class="back-link">← 返回主页</NuxtLink>
      </nav>

      <div class="tool-card">
        <header class="tool-header">
          <h1>逗号分隔器</h1>
          <p>将多行文本快速转换为逗号分隔格式</p>
        </header>

        <div class="field">
          <label class="field-label">输入内容（每行一个）</label>
          <textarea
            v-model="inputText"
            class="textarea"
            rows="8"
            spellcheck="false"
            placeholder="每行输入一个值，例如：&#10;苹果&#10;香蕉&#10;橙子"
          ></textarea>
        </div>

        <div class="options-box">
          <span class="field-label">输出格式</span>
          <div class="radio-group">
            <label
              class="radio-item"
              :class="{ 'is-active': mode === 'plain' }"
            >
              <input type="radio" v-model="mode" value="plain" />
              <span class="radio-text">逗号分隔</span>
              <code class="preview">a, b, c</code>
            </label>
            <label
              class="radio-item"
              :class="{ 'is-active': mode === 'quoted' }"
            >
              <input type="radio" v-model="mode" value="quoted" />
              <span class="radio-text">逗号单引号分隔</span>
              <code class="preview">'a', 'b', 'c'</code>
            </label>
            <label class="radio-item" :class="{ 'is-active': mode === 'list' }">
              <input type="radio" v-model="mode" value="list" />
              <span class="radio-text">字符串列表（双引号）</span>
              <code class="preview">["a", "b", "c"]</code>
            </label>
            <label
              class="radio-item"
              :class="{ 'is-active': mode === 'list-single' }"
            >
              <input type="radio" v-model="mode" value="list-single" />
              <span class="radio-text">字符串列表（单引号）</span>
              <code class="preview">['a', 'b', 'c']</code>
            </label>
          </div>
        </div>

        <div class="field">
          <div class="field-row">
            <label class="field-label">输出结果</label>
            <div class="field-meta">
              <span v-if="itemCount > 0" class="count-tag"
                >{{ itemCount }} 项</span
              >
              <button
                class="copy-btn"
                :class="{ 'is-copied': copied }"
                :disabled="!outputText"
                @click="copyResult"
              >
                {{ copied ? "已复制 ✓" : "复制" }}
              </button>
            </div>
          </div>
          <textarea
            :value="outputText"
            readonly
            class="textarea textarea--output"
            rows="4"
            placeholder="转换结果将显示在这里…"
            spellcheck="false"
          ></textarea>
        </div>
      </div>

      <!-- 工具说明 -->
      <article class="tool-desc">
        <h2>关于逗号分隔器</h2>
        <p>
          将多行文本一键转换为逗号分隔格式。最典型的使用场景是拼写 SQL 的 IN
          查询：从系统里复制一列 ID 或名称，粘贴进来，一键转成
          <code>WHERE id IN ('a', 'b', 'c')</code>
          所需的格式，省去手动逐行添加引号和逗号的繁琐操作。
        </p>
        <h3>使用方法</h3>
        <ol>
          <li>在输入框中每行粘贴一个值（从 Excel、Notepad 或终端复制均可）</li>
          <li>
            选择输出格式：<strong>逗号分隔</strong>（<code>a, b, c</code
            >）或<strong>单引号分隔</strong>（<code>'a', 'b', 'c'</code>）
          </li>
          <li>点击「复制」按钮，结果直接进入剪贴板，粘贴即用</li>
        </ol>
        <h3>适用场景</h3>
        <p>
          拼写 SQL IN 语句时批量处理 ID 或名称列表；将 Excel 某列数据转成
          Python/JavaScript
          数组字面量；整理接口请求参数时把多行条目格式化成单行传参；快速统计行数（输入框右上角实时显示项目数）。工具完全在浏览器端处理，不联网、无任何数据存储。
        </p>
      </article>

      <!-- 相关工具 -->
      <nav class="related-tools">
        <p class="related-title">相关工具</p>
        <div class="related-links">
          <NuxtLink to="/md-excel" class="related-link"
            >📊 Markdown ↔ Excel</NuxtLink
          >
          <NuxtLink to="/caculate" class="related-link">🧾 简易算帐</NuxtLink>
          <NuxtLink to="/currency" class="related-link">💱 汇率计算器</NuxtLink>
        </div>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

useSeoMeta({
  title: "逗号分隔器",
  ogTitle: "逗号分隔器 – Toool",
  description:
    "将文本按行分割，快速转换为逗号分隔或逗号单引号分隔格式，适用于 SQL IN 查询等场景",
  ogDescription:
    "将文本按行分割，快速转换为逗号分隔或逗号单引号分隔格式，适用于 SQL IN 查询等场景",
});

const inputText = ref("");
const mode = ref<"plain" | "quoted" | "list" | "list-single">("plain");
const copied = ref(false);

const lines = computed(() =>
  inputText.value
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0)
);

const itemCount = computed(() => lines.value.length);

const outputText = computed(() => {
  if (!lines.value.length) return "";
  if (mode.value === "plain") return lines.value.join(", ");
  if (mode.value === "quoted")
    return lines.value.map((l) => `'${l}'`).join(", ");
  if (mode.value === "list")
    return "[" + lines.value.map((l) => `"${l}"`).join(", ") + "]";
  return "[" + lines.value.map((l) => `'${l}'`).join(", ") + "]";
});

const copyResult = async () => {
  if (!outputText.value) return;
  await navigator.clipboard.writeText(outputText.value);
  copied.value = true;
  setTimeout(() => {
    copied.value = false;
  }, 2000);
};
</script>

<style scoped>
.tool-page {
  padding: 1.5rem var(--page-pad) 3rem;
}
.tool-page-inner {
  max-width: 680px;
  margin: 0 auto;
}

/* Back link */
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

/* Card */
.tool-card {
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: var(--r-xl);
  padding: 2rem;
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Header */
.tool-header {
  text-align: center;
}
.tool-header h1 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--c-text-1);
  letter-spacing: -0.02em;
  margin-bottom: 0.35rem;
}
.tool-header p {
  font-size: 0.9rem;
  color: var(--c-text-2);
}

/* Fields */
.field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.field-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--c-text-1);
}
.field-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.field-meta {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.count-tag {
  font-size: 0.78rem;
  color: var(--c-text-3);
  background: var(--c-surface-2);
  border: 1px solid var(--c-border);
  padding: 0.1rem 0.5rem;
  border-radius: 99px;
}

/* Textarea */
.textarea {
  width: 100%;
  padding: 0.7rem 0.9rem;
  border: 1px solid var(--c-border);
  border-radius: var(--r-md);
  font-size: 0.875rem;
  font-family: "SF Mono", "Fira Code", monospace;
  color: var(--c-text-1);
  background: var(--c-surface);
  resize: vertical;
  line-height: 1.6;
  outline: none;
  transition: border-color 0.18s, box-shadow 0.18s;
}
.textarea:focus {
  border-color: var(--c-accent);
  box-shadow: 0 0 0 3px var(--c-accent-bg);
}
.textarea--output {
  background: var(--c-surface-2);
  color: var(--c-text-2);
  cursor: default;
}

/* Options box */
.options-box {
  background: var(--c-surface-2);
  border: 1px solid var(--c-border);
  border-radius: var(--r-lg);
  padding: 1rem 1.1rem;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}

.radio-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.radio-item {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.5rem 0.75rem;
  border-radius: var(--r-md);
  border: 1px solid transparent;
  cursor: pointer;
  transition: background 0.14s, border-color 0.14s;
}
.radio-item:hover {
  background: var(--c-accent-bg);
}
.radio-item.is-active {
  background: var(--c-accent-bg);
  border-color: var(--c-accent-muted);
}
.radio-item input[type="radio"] {
  accent-color: var(--c-accent);
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
}
.radio-text {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--c-text-1);
}

.preview {
  margin-left: auto;
  font-family: "SF Mono", "Fira Code", monospace;
  font-size: 0.78rem;
  background: #e2e8f0;
  color: var(--c-text-2);
  padding: 0.15rem 0.5rem;
  border-radius: var(--r-sm);
}

/* Copy button */
.copy-btn {
  padding: 0.3rem 0.85rem;
  background: var(--c-accent);
  color: #fff;
  border: none;
  border-radius: var(--r-md);
  font-size: 0.8125rem;
  font-weight: 600;
  transition: background 0.15s;
}
.copy-btn:hover:not(:disabled) {
  background: var(--c-accent-dark);
}
.copy-btn:disabled {
  background: var(--c-border);
  color: var(--c-text-3);
  cursor: not-allowed;
}
.copy-btn.is-copied {
  background: var(--c-success);
}

/* Mobile */
@media (max-width: 640px) {
  .tool-page {
    padding: 1rem var(--page-pad) 2rem;
  }
  .tool-card {
    padding: 1.25rem 1rem;
    border-radius: var(--r-lg);
  }
  .preview {
    display: none;
  }
}
</style>
