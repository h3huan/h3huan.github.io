<template>
  <div class="tool-page">
    <div class="tool-page-inner">

      <nav class="tool-back">
        <NuxtLink to="/" class="back-link">← 返回主页</NuxtLink>
      </nav>

      <div class="tool-card">
        <header class="tool-header">
          <h1>Markdown 表格 ↔ Excel</h1>
          <p>Markdown 表格与 Excel 数据互相转换</p>
        </header>

        <!-- Tabs -->
        <div class="tabs">
          <button
            :class="['tab', { 'tab--active': tab === 'md2excel' }]"
            @click="tab = 'md2excel'"
          >Markdown → Excel</button>
          <button
            :class="['tab', { 'tab--active': tab === 'excel2md' }]"
            @click="tab = 'excel2md'"
          >Excel → Markdown</button>
        </div>

        <!-- Markdown → Excel -->
        <div v-if="tab === 'md2excel'" class="panel">
          <div class="field">
            <label class="field-label">输入 Markdown 表格</label>
            <textarea
              v-model="mdInput"
              class="textarea"
              rows="9"
              spellcheck="false"
              placeholder="| 姓名 | 年龄 | 城市 |&#10;|------|------|------|&#10;| 张三 | 25   | 北京 |&#10;| 李四 | 30   | 上海 |"
            ></textarea>
          </div>

          <div v-if="md2excelError" class="msg msg--error">{{ md2excelError }}</div>

          <div v-if="excelOutput" class="field">
            <div class="field-row">
              <label class="field-label">粘贴到 Excel 即可使用</label>
              <button class="copy-btn" :class="{ 'is-copied': copiedExcel }" @click="copyExcel">
                {{ copiedExcel ? '已复制 ✓' : '复制' }}
              </button>
            </div>
            <textarea :value="excelOutput" readonly class="textarea textarea--output" rows="7" spellcheck="false"></textarea>
            <p class="hint">提示：在 Excel 中选中目标单元格，然后粘贴（Ctrl+V / ⌘V）</p>
          </div>
        </div>

        <!-- Excel → Markdown -->
        <div v-else class="panel">
          <div class="field">
            <label class="field-label">从 Excel 复制后粘贴到此处</label>
            <textarea
              v-model="excelInput"
              class="textarea"
              rows="9"
              spellcheck="false"
              placeholder="在 Excel 中选中表格区域，Ctrl+C 复制，然后粘贴到这里"
            ></textarea>
          </div>

          <div v-if="excel2mdError" class="msg msg--error">{{ excel2mdError }}</div>

          <div v-if="mdOutput" class="field">
            <div class="field-row">
              <label class="field-label">Markdown 表格</label>
              <button class="copy-btn" :class="{ 'is-copied': copiedMd }" @click="copyMd">
                {{ copiedMd ? '已复制 ✓' : '复制' }}
              </button>
            </div>
            <textarea :value="mdOutput" readonly class="textarea textarea--output" rows="7" spellcheck="false"></textarea>
          </div>
        </div>

      </div>

      <!-- 工具说明 -->
      <article class="tool-desc">
        <h2>关于 Markdown 表格与 Excel 双向转换</h2>
        <p>在写 Markdown 文档和使用 Excel 处理数据之间反复切换时，手动重新排版表格既费时又容易出错。本工具提供双向一键转换：将 Markdown 表格转成可直接粘贴到 Excel 的制表符格式，或将 Excel 数据转成标准 Markdown 表格语法。</p>
        <h3>Markdown → Excel 使用方法</h3>
        <ol>
          <li>把 Markdown 表格（包含 <code>|</code> 分隔符的格式）粘贴到输入框</li>
          <li>点击「复制」，在 Excel 中选中目标单元格后 <code>Ctrl+V</code> 粘贴，列结构自动对齐</li>
        </ol>
        <h3>Excel → Markdown 使用方法</h3>
        <ol>
          <li>在 Excel 中选中表格区域，<code>Ctrl+C</code> 复制</li>
          <li>粘贴到输入框，工具自动生成列宽对齐的标准 Markdown 表格</li>
        </ol>
        <h3>Markdown 表格语法说明</h3>
        <p>标准 Markdown 表格由三部分组成：表头行（<code>| 列名 | 列名 |</code>）、分隔行（<code>| --- | --- |</code>）和数据行。生成的 Markdown 在 GitHub、Notion、Typora、Obsidian 等平台均可直接渲染为表格。</p>
      </article>

      <!-- 相关工具 -->
      <nav class="related-tools">
        <p class="related-title">相关工具</p>
        <div class="related-links">
          <NuxtLink to="/comma-separator/" class="related-link">✂️ 逗号分隔器</NuxtLink>
          <NuxtLink to="/caculate/" class="related-link">🧾 简易算帐</NuxtLink>
          <NuxtLink to="/currency/" class="related-link">💱 汇率计算器</NuxtLink>
        </div>
      </nav>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

useSeoMeta({
  title: 'Markdown 表格 ↔ Excel',
  ogTitle: 'Markdown 表格 ↔ Excel – Toool',
  description: 'Markdown 表格与 Excel 数据互相转换，支持一键复制粘贴',
  ogDescription: 'Markdown 表格与 Excel 数据互相转换，支持一键复制粘贴',
})

const tab = ref<'md2excel' | 'excel2md'>('md2excel');

// ── Markdown → Excel (tab-separated) ─────────────────────────
const mdInput      = ref('');
const copiedExcel  = ref(false);
const md2excelError = ref('');

const excelOutput = computed(() => {
  md2excelError.value = '';
  const raw = mdInput.value.trim();
  if (!raw) return '';

  const rows = raw
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 0)
    .filter(l => !/^\|[\s|:-]+\|$/.test(l)); // skip separator rows

  if (!rows.length) return '';

  const parsed = rows.map(row =>
    row.replace(/^\|/, '').replace(/\|$/, '').split('|').map(c => c.trim())
  );

  const colCount = parsed[0].length;
  if (parsed.some(r => r.length !== colCount)) {
    md2excelError.value = '表格列数不一致，请检查 Markdown 格式';
    return '';
  }

  return parsed.map(r => r.join('\t')).join('\n');
});

const copyExcel = async () => {
  if (!excelOutput.value) return;
  await navigator.clipboard.writeText(excelOutput.value);
  copiedExcel.value = true;
  setTimeout(() => { copiedExcel.value = false; }, 2000);
};

// ── Excel (tab-separated) → Markdown ─────────────────────────
const excelInput    = ref('');
const copiedMd      = ref(false);
const excel2mdError = ref('');

const mdOutput = computed(() => {
  excel2mdError.value = '';
  const raw = excelInput.value.trim();
  if (!raw) return '';

  const rows = raw
    .split('\n')
    .map(l => l.trimEnd())
    .filter(l => l.length > 0)
    .map(l => l.split('\t').map(c => c.trim()));

  if (!rows.length) return '';

  const colCount  = Math.max(...rows.map(r => r.length));
  const normalized = rows.map(r => { while (r.length < colCount) r.push(''); return r; });
  const widths     = Array.from({ length: colCount }, (_, ci) =>
    Math.max(3, ...normalized.map(r => r[ci].length))
  );

  const fmt = (cells: string[]) =>
    '| ' + cells.map((c, i) => c.padEnd(widths[i])).join(' | ') + ' |';
  const sep = '| ' + widths.map(w => '-'.repeat(w)).join(' | ') + ' |';

  const [header, ...data] = normalized;
  return [fmt(header), sep, ...data.map(fmt)].join('\n');
});

const copyMd = async () => {
  if (!mdOutput.value) return;
  await navigator.clipboard.writeText(mdOutput.value);
  copiedMd.value = true;
  setTimeout(() => { copiedMd.value = false; }, 2000);
};
</script>

<style scoped>
.tool-page { padding: 1.5rem var(--page-pad) 3rem; }
.tool-page-inner { max-width: 760px; margin: 0 auto; }

/* Back link */
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
.back-link:hover { color: var(--c-accent); border-color: var(--c-accent-muted); background: var(--c-accent-bg); }

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
.tool-header { text-align: center; }
.tool-header h1 { font-size: 1.5rem; font-weight: 700; color: var(--c-text-1); letter-spacing: -0.02em; margin-bottom: 0.35rem; }
.tool-header p  { font-size: 0.9rem; color: var(--c-text-2); }

/* Tabs */
.tabs {
  display: flex;
  gap: 0.4rem;
  background: var(--c-surface-2);
  border: 1px solid var(--c-border);
  border-radius: var(--r-lg);
  padding: 0.25rem;
}
.tab {
  flex: 1;
  padding: 0.5rem 0.75rem;
  border: none;
  border-radius: var(--r-md);
  background: transparent;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--c-text-2);
  transition: background 0.15s, color 0.15s, box-shadow 0.15s;
}
.tab:hover:not(.tab--active) { color: var(--c-text-1); }
.tab--active {
  background: var(--c-surface);
  color: var(--c-text-1);
  box-shadow: 0 1px 4px rgba(0,0,0,0.1);
}

/* Panel */
.panel { display: flex; flex-direction: column; gap: 1.25rem; }

/* Fields */
.field { display: flex; flex-direction: column; gap: 0.5rem; }
.field-label { font-size: 0.875rem; font-weight: 600; color: var(--c-text-1); }
.field-row { display: flex; justify-content: space-between; align-items: center; }

/* Textarea */
.textarea {
  width: 100%;
  padding: 0.7rem 0.9rem;
  border: 1px solid var(--c-border);
  border-radius: var(--r-md);
  font-size: 0.8125rem;
  font-family: 'SF Mono', 'Fira Code', monospace;
  color: var(--c-text-1);
  background: var(--c-surface);
  resize: vertical;
  line-height: 1.6;
  outline: none;
  transition: border-color 0.18s, box-shadow 0.18s;
}
.textarea:focus { border-color: var(--c-accent); box-shadow: 0 0 0 3px var(--c-accent-bg); }
.textarea--output { background: var(--c-surface-2); color: var(--c-text-2); cursor: default; }

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
.copy-btn:hover { background: var(--c-accent-dark); }
.copy-btn.is-copied { background: var(--c-success); }

/* Messages */
.msg {
  padding: 0.6rem 0.9rem;
  border-radius: var(--r-md);
  font-size: 0.85rem;
}
.msg--error {
  background: var(--c-danger-bg);
  border: 1px solid #fca5a5;
  color: var(--c-danger);
}

.hint { font-size: 0.8rem; color: var(--c-text-3); }

/* Mobile */
@media (max-width: 640px) {
  .tool-page { padding: 1rem var(--page-pad) 2rem; }
  .tool-card { padding: 1.25rem 1rem; border-radius: var(--r-lg); }
  .tab       { font-size: 0.8125rem; padding: 0.45rem 0.5rem; }
}
</style>
