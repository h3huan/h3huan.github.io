<template>
  <div class="tool-page">
    <div class="tool-page-inner">

      <nav class="tool-back">
        <NuxtLink to="/" class="back-link">← 返回主页</NuxtLink>
      </nav>

      <div class="tool-card">
        <header class="tool-header">
          <h1>列表 ↔ 表格</h1>
          <p>二维列表与 Markdown / Excel 表格互相转换</p>
        </header>

        <!-- 主 Tab -->
        <div class="tabs">
          <button :class="['tab', { 'tab--active': tab === 'list2table' }]" @click="tab = 'list2table'">列表 → 表格</button>
          <button :class="['tab', { 'tab--active': tab === 'table2list' }]" @click="tab = 'table2list'">表格 → 列表</button>
        </div>

        <!-- ── 列表 → 表格 ── -->
        <div v-if="tab === 'list2table'" class="panel">

          <div class="field">
            <div class="field-row">
              <label class="field-label">输入列表</label>
              <select v-model="listInputFormat" class="fmt-select">
                <option value="json">JSON</option>
                <option value="python">Python 列表</option>
              </select>
            </div>
            <textarea
              v-model="listInput"
              class="textarea"
              rows="7"
              spellcheck="false"
              :placeholder="listInputFormat === 'python' ? placeholderPython : placeholderJson"
            ></textarea>
          </div>

          <div v-if="listParseError" class="msg msg--error">{{ listParseError }}</div>

          <!-- 预览表格 -->
          <template v-if="listRows.length">
            <div class="preview-wrap">
              <div class="preview-scroll">
                <table class="preview-table">
                  <thead>
                    <tr><th v-for="(cell, i) in listRows[0]" :key="i">{{ cell }}</th></tr>
                  </thead>
                  <tbody>
                    <tr v-for="(row, ri) in listRows.slice(1)" :key="ri">
                      <td v-for="(cell, ci) in row" :key="ci">{{ cell }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div class="field">
              <div class="field-row">
                <label class="field-label">文本输出</label>
                <div class="row-controls">
                  <select v-model="listOutputTableFormat" class="fmt-select">
                    <option value="markdown">Markdown</option>
                    <option value="tsv">Excel (TSV)</option>
                  </select>
                  <button class="copy-btn" :class="{ 'is-copied': copiedTable }" @click="copyTable">
                    {{ copiedTable ? '已复制 ✓' : '复制' }}
                  </button>
                </div>
              </div>
              <textarea :value="tableTextOutput" readonly class="textarea textarea--output" rows="6" spellcheck="false"></textarea>
              <p v-if="listOutputTableFormat === 'tsv'" class="hint">提示：在 Excel 中选中目标单元格后 Ctrl+V 粘贴，列结构自动对齐</p>
            </div>
          </template>

        </div>

        <!-- ── 表格 → 列表 ── -->
        <div v-else class="panel">

          <div class="field">
            <div class="field-row">
              <label class="field-label">输入表格</label>
              <select v-model="tableInputFormat" class="fmt-select">
                <option value="markdown">Markdown</option>
                <option value="tsv">Excel (TSV)</option>
              </select>
            </div>
            <textarea
              v-model="tableInput"
              class="textarea"
              rows="7"
              spellcheck="false"
              :placeholder="tableInputFormat === 'tsv' ? placeholderTsv : placeholderMd"
            ></textarea>
          </div>

          <div v-if="tableParseError" class="msg msg--error">{{ tableParseError }}</div>

          <!-- 预览表格 -->
          <div v-if="tableRows.length" class="preview-wrap">
            <div class="preview-scroll">
              <table class="preview-table">
                <thead>
                  <tr><th v-for="(cell, i) in tableRows[0]" :key="i">{{ cell }}</th></tr>
                </thead>
                <tbody>
                  <tr v-for="(row, ri) in tableRows.slice(1)" :key="ri">
                    <td v-for="(cell, ci) in row" :key="ci">{{ cell }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div v-if="listTextOutput" class="field">
            <div class="field-row">
              <label class="field-label">{{ tableRows.length === 1 ? '一维列表（单行）' : '二维列表' }}</label>
              <div class="row-controls">
                <select v-model="listOutputFormat" class="fmt-select">
                  <option value="json">JSON</option>
                  <option value="python">Python 列表</option>
                </select>
                <button class="copy-btn" :class="{ 'is-copied': copiedList }" @click="copyList">
                  {{ copiedList ? '已复制 ✓' : '复制' }}
                </button>
              </div>
            </div>
            <textarea :value="listTextOutput" readonly class="textarea textarea--output" rows="6" spellcheck="false"></textarea>
          </div>

        </div>

      </div>

      <!-- 工具说明 -->
      <article class="tool-desc">
        <h2>关于列表与表格双向转换</h2>
        <p>支持 JSON / Python 列表格式与 Markdown 表格、Excel（TSV）之间的任意组合转换，输入后即时渲染为可视化表格预览。</p>
        <h3>列表 → 表格</h3>
        <ol>
          <li>输入 JSON 或 Python 格式的二维数组，第一行视为表头</li>
          <li>选择输出格式：Markdown 可直接用于文档；Excel (TSV) 可粘贴到 Excel</li>
          <li>一维数组将生成只含表头的单行表格</li>
        </ol>
        <h3>表格 → 列表</h3>
        <ol>
          <li>Markdown：粘贴含 <code>|</code> 的表格文本</li>
          <li>Excel (TSV)：在 Excel 选中区域 <code>Ctrl+C</code>，粘贴到输入框</li>
          <li>选择输出格式（JSON / Python），若去除分隔行后只剩一行则输出一维列表</li>
        </ol>
      </article>

      <!-- 相关工具 -->
      <nav class="related-tools">
        <p class="related-title">相关工具</p>
        <div class="related-links">
          <NuxtLink to="/md-excel/" class="related-link">📊 Markdown ↔ Excel</NuxtLink>
          <NuxtLink to="/comma-separator/" class="related-link">✂️ 逗号分隔器</NuxtLink>
          <NuxtLink to="/caculate/" class="related-link">🧾 简易算帐</NuxtLink>
        </div>
      </nav>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

useSeoMeta({
  title: '列表转表格 - 二维列表与 Markdown/Excel 表格互转 - Toool',
  ogTitle: '列表转表格 - 二维列表与 Markdown/Excel 表格互转 - Toool',
  description: 'JSON / Python 二维列表与 Markdown 表格、Excel(TSV) 一键互转，即时渲染可视化预览，列宽自动对齐。',
  ogDescription: 'JSON / Python 二维列表与 Markdown 表格、Excel(TSV) 一键互转，即时渲染可视化预览，列宽自动对齐。',
  keywords: '列表转表格,二维列表转markdown,json转markdown表格,表格转列表,excel转列表,python列表转表格',
})

const tab = ref<'list2table' | 'table2list'>('list2table');

// ── placeholders ───────────────────────────────────────────
const placeholderJson   = `[["姓名","年龄","城市"],["张三",25,"北京"],["李四",30,"上海"]]`;
const placeholderPython = `[['姓名','年龄','城市'],['张三',25,'北京'],['李四',30,'上海']]`;
const placeholderMd     = `| 姓名 | 年龄 | 城市 |\n|------|------|------|\n| 张三 | 25   | 北京 |\n| 李四 | 30   | 上海 |`;
const placeholderTsv    = `在 Excel 中选中表格区域，Ctrl+C 复制，然后粘贴到这里`;

// ── format refs ────────────────────────────────────────────
const listInputFormat     = ref<'json' | 'python'>('json');
const listOutputTableFormat = ref<'markdown' | 'tsv'>('markdown');
const tableInputFormat    = ref<'markdown' | 'tsv'>('markdown');
const listOutputFormat    = ref<'json' | 'python'>('json');

// ── copy state ─────────────────────────────────────────────
const copiedTable = ref(false);
const copiedList  = ref(false);

// ── helpers ────────────────────────────────────────────────

function pythonToJson(raw: string): unknown {
  let s = raw.replace(/\\'/g, ' AP ');
  s = s.replace(/'([^']*)'/g, (_, inner) => '"' + inner.replace(/"/g, '\\"') + '"');
  s = s.replace(/ AP /g, "'");
  s = s.replace(/\bTrue\b/g, 'true').replace(/\bFalse\b/g, 'false').replace(/\bNone\b/g, 'null');
  return JSON.parse(s);
}

function toPyStr(s: string): string {
  return "'" + s.replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
}

function toMarkdown(rows: string[][]): string {
  const cols = rows[0].length;
  const widths = Array.from({ length: cols }, (_, ci) =>
    Math.max(3, ...rows.map(r => (r[ci] ?? '').length))
  );
  const fmt = (cells: string[]) =>
    '| ' + cells.map((c, i) => (c ?? '').padEnd(widths[i])).join(' | ') + ' |';
  const sep = '| ' + widths.map(w => '-'.repeat(w)).join(' | ') + ' |';
  const [header, ...data] = rows;
  return [fmt(header), sep, ...data.map(fmt)].join('\n');
}

function toTsv(rows: string[][]): string {
  return rows.map(r => r.join('\t')).join('\n');
}

function serializeList(rows: string[][]): string {
  const data: string[] | string[][] = rows.length === 1 ? rows[0] : rows;
  if (listOutputFormat.value === 'python') {
    if (!Array.isArray(data[0])) {
      return '[' + (data as string[]).map(toPyStr).join(', ') + ']';
    }
    const inner = (data as string[][]).map(row => '[' + row.map(toPyStr).join(', ') + ']');
    return '[\n  ' + inner.join(',\n  ') + '\n]';
  }
  return JSON.stringify(data, null, 2);
}

// ── 列表 → 表格 ────────────────────────────────────────────

const listInput      = ref('');
const listParseError = ref('');

const listRows = computed((): string[][] => {
  listParseError.value = '';
  const raw = listInput.value.trim();
  if (!raw) return [];

  let parsed: unknown;
  try {
    parsed = listInputFormat.value === 'python' ? pythonToJson(raw) : JSON.parse(raw);
  } catch {
    listParseError.value = listInputFormat.value === 'python'
      ? 'Python 列表格式错误，请检查括号、逗号和引号'
      : 'JSON 格式错误，请检查括号、逗号和引号';
    return [];
  }

  if (!Array.isArray(parsed) || parsed.length === 0) {
    listParseError.value = '请输入非空数组';
    return [];
  }

  // 一维 → 单行
  if (!Array.isArray((parsed as unknown[])[0])) {
    return [(parsed as unknown[]).map(v => String(v ?? ''))];
  }

  const rows = (parsed as unknown[][]).map(r => r.map(v => String(v ?? '')));
  const colCount = rows[0].length;
  if (rows.some(r => r.length !== colCount)) {
    listParseError.value = '每行列数不一致，请检查数据';
    return [];
  }
  return rows;
});

const tableTextOutput = computed((): string => {
  const rows = listRows.value;
  if (!rows.length) return '';
  return listOutputTableFormat.value === 'tsv' ? toTsv(rows) : toMarkdown(rows);
});

const copyTable = async () => {
  if (!tableTextOutput.value) return;
  await navigator.clipboard.writeText(tableTextOutput.value);
  copiedTable.value = true;
  setTimeout(() => { copiedTable.value = false; }, 2000);
};

// ── 表格 → 列表 ────────────────────────────────────────────

const tableInput      = ref('');
const tableParseError = ref('');

const tableRows = computed((): string[][] => {
  tableParseError.value = '';
  const raw = tableInput.value.trim();
  if (!raw) return [];

  if (tableInputFormat.value === 'tsv') {
    const rows = raw
      .split('\n')
      .map(l => l.trimEnd())
      .filter(l => l.length > 0)
      .map(l => l.split('\t').map(c => c.trim()));
    if (!rows.length) return [];
    const colCount = Math.max(...rows.map(r => r.length));
    return rows.map(r => { while (r.length < colCount) r.push(''); return r; });
  }

  // Markdown
  const rows = raw
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 0)
    .filter(l => !/^\|[\s|:-]+\|$/.test(l))
    .map(l => l.replace(/^\|/, '').replace(/\|$/, '').split('|').map(c => c.trim()));

  if (!rows.length) return [];
  const colCount = rows[0].length;
  if (rows.some(r => r.length !== colCount)) {
    tableParseError.value = '表格列数不一致，请检查 Markdown 格式';
    return [];
  }
  return rows;
});

const listTextOutput = computed((): string => {
  const rows = tableRows.value;
  if (!rows.length) return '';
  return serializeList(rows);
});

const copyList = async () => {
  if (!listTextOutput.value) return;
  await navigator.clipboard.writeText(listTextOutput.value);
  copiedList.value = true;
  setTimeout(() => { copiedList.value = false; }, 2000);
};
</script>

<style scoped>
.tool-page { padding: 1.5rem var(--page-pad) 3rem; }
.tool-page-inner { max-width: 760px; margin: 0 auto; }

/* Back link */
.tool-back { margin-bottom: 1.25rem; }
.back-link {
  display: inline-flex; align-items: center; gap: 0.35rem;
  font-size: 0.875rem; font-weight: 500; color: var(--c-text-2);
  padding: 0.3rem 0.7rem; border-radius: var(--r-md);
  border: 1px solid var(--c-border); background: var(--c-surface);
  transition: color 0.15s, background 0.15s, border-color 0.15s;
}
.back-link:hover { color: var(--c-accent); border-color: var(--c-accent-muted); background: var(--c-accent-bg); }

/* Card */
.tool-card {
  background: var(--c-surface); border: 1px solid var(--c-border);
  border-radius: var(--r-xl); padding: 2rem;
  box-shadow: var(--shadow-sm); display: flex; flex-direction: column; gap: 1.5rem;
}

/* Header */
.tool-header { text-align: center; }
.tool-header h1 { font-size: 1.5rem; font-weight: 700; color: var(--c-text-1); letter-spacing: -0.02em; margin-bottom: 0.35rem; }
.tool-header p  { font-size: 0.9rem; color: var(--c-text-2); }

/* Tabs */
.tabs {
  display: flex; gap: 0.4rem;
  background: var(--c-surface-2); border: 1px solid var(--c-border);
  border-radius: var(--r-lg); padding: 0.25rem;
}
.tab {
  flex: 1; padding: 0.5rem 0.75rem; border: none; border-radius: var(--r-md);
  background: transparent; font-size: 0.875rem; font-weight: 500; color: var(--c-text-2);
  transition: background 0.15s, color 0.15s, box-shadow 0.15s;
}
.tab:hover:not(.tab--active) { color: var(--c-text-1); }
.tab--active { background: var(--c-surface); color: var(--c-text-1); box-shadow: 0 1px 4px rgba(0,0,0,0.1); }

/* Panel */
.panel { display: flex; flex-direction: column; gap: 1.25rem; }

/* Fields */
.field { display: flex; flex-direction: column; gap: 0.5rem; }
.field-label { font-size: 0.875rem; font-weight: 600; color: var(--c-text-1); }
.field-row { display: flex; justify-content: space-between; align-items: center; }
.row-controls { display: flex; align-items: center; gap: 0.5rem; }

/* Textarea */
.textarea {
  width: 100%; padding: 0.7rem 0.9rem;
  border: 1px solid var(--c-border); border-radius: var(--r-md);
  font-size: 0.8125rem; font-family: 'SF Mono', 'Fira Code', monospace;
  color: var(--c-text-1); background: var(--c-surface);
  resize: vertical; line-height: 1.6; outline: none;
  transition: border-color 0.18s, box-shadow 0.18s;
}
.textarea:focus { border-color: var(--c-accent); box-shadow: 0 0 0 3px var(--c-accent-bg); }
.textarea--output { background: var(--c-surface-2); color: var(--c-text-2); cursor: default; }

/* Format select */
.fmt-select {
  padding: 0.25rem 0.6rem; border: 1px solid var(--c-border);
  border-radius: var(--r-md); background: var(--c-surface-2);
  color: var(--c-text-2); font-size: 0.8125rem; font-weight: 500;
  outline: none; cursor: pointer; transition: border-color 0.15s, color 0.15s;
}
.fmt-select:focus, .fmt-select:hover { border-color: var(--c-accent); color: var(--c-text-1); }

/* Copy button */
.copy-btn {
  padding: 0.3rem 0.85rem; background: var(--c-accent); color: #fff;
  border: none; border-radius: var(--r-md); font-size: 0.8125rem; font-weight: 600;
  transition: background 0.15s; white-space: nowrap;
}
.copy-btn:hover { background: var(--c-accent-dark); }
.copy-btn.is-copied { background: var(--c-success); }

/* Messages */
.msg { padding: 0.6rem 0.9rem; border-radius: var(--r-md); font-size: 0.85rem; }
.msg--error { background: var(--c-danger-bg); border: 1px solid #fca5a5; color: var(--c-danger); }

.hint { font-size: 0.8rem; color: var(--c-text-3); }

/* ── 可视化表格预览 ─────────────────────────────────────── */
.preview-wrap {
  border: 1px solid var(--c-border);
  border-radius: var(--r-lg);
  overflow: hidden;
}
.preview-scroll {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}
.preview-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8125rem;
  white-space: nowrap;
}
.preview-table thead tr {
  background: var(--c-surface-2);
  border-bottom: 2px solid var(--c-border);
}
.preview-table th {
  padding: 0.55rem 0.85rem;
  font-weight: 600;
  color: var(--c-text-1);
  text-align: left;
  border-right: 1px solid var(--c-border);
}
.preview-table th:last-child { border-right: none; }
.preview-table tbody tr {
  border-bottom: 1px solid var(--c-border);
  transition: background 0.1s;
}
.preview-table tbody tr:last-child { border-bottom: none; }
.preview-table tbody tr:hover { background: var(--c-surface-2); }
.preview-table td {
  padding: 0.5rem 0.85rem;
  color: var(--c-text-2);
  border-right: 1px solid var(--c-border);
}
.preview-table td:last-child { border-right: none; }

/* Description */
.tool-desc {
  margin-top: 2rem; padding: 1.5rem;
  background: var(--c-surface); border: 1px solid var(--c-border); border-radius: var(--r-xl);
}
.tool-desc h2 { font-size: 1.1rem; font-weight: 700; margin-bottom: 0.75rem; }
.tool-desc h3 { font-size: 0.95rem; font-weight: 600; margin: 1rem 0 0.5rem; }
.tool-desc p, .tool-desc li { font-size: 0.875rem; color: var(--c-text-2); line-height: 1.7; }
.tool-desc ol { padding-left: 1.25rem; }
.tool-desc code {
  font-family: 'SF Mono', 'Fira Code', monospace; font-size: 0.8125rem;
  background: var(--c-surface-2); border: 1px solid var(--c-border);
  padding: 0.1em 0.4em; border-radius: 4px;
}

/* Related tools */
.related-tools { margin-top: 1.5rem; }
.related-title { font-size: 0.8125rem; font-weight: 600; color: var(--c-text-3); margin-bottom: 0.6rem; text-transform: uppercase; letter-spacing: 0.05em; }
.related-links { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.related-link {
  font-size: 0.8125rem; color: var(--c-text-2);
  padding: 0.3rem 0.75rem; border: 1px solid var(--c-border);
  border-radius: var(--r-md); background: var(--c-surface);
  transition: color 0.15s, border-color 0.15s, background 0.15s;
}
.related-link:hover { color: var(--c-accent); border-color: var(--c-accent-muted); background: var(--c-accent-bg); }

/* Mobile */
@media (max-width: 640px) {
  .tool-page { padding: 1rem var(--page-pad) 2rem; }
  .tool-card { padding: 1.25rem 1rem; border-radius: var(--r-lg); }
  .tab { font-size: 0.8125rem; padding: 0.45rem 0.5rem; }
  .preview-table { font-size: 0.75rem; }
  .preview-table th, .preview-table td { padding: 0.4rem 0.6rem; }
}
</style>
