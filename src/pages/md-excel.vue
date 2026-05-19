<template>
  <div class="tool-wrapper">
    <div class="tool-card">

      <header class="tool-header">
        <h1>Markdown 表格 ↔ Excel</h1>
        <p>Markdown 表格与 Excel 数据互相转换</p>
      </header>

      <div class="tabs">
        <button
          :class="['tab-btn', { active: tab === 'md2excel' }]"
          @click="tab = 'md2excel'"
        >
          Markdown → Excel
        </button>
        <button
          :class="['tab-btn', { active: tab === 'excel2md' }]"
          @click="tab = 'excel2md'"
        >
          Excel → Markdown
        </button>
      </div>

      <!-- Markdown → Excel -->
      <div v-if="tab === 'md2excel'" class="panel">
        <div class="section">
          <label class="section-label">输入 Markdown 表格</label>
          <textarea
            v-model="mdInput"
            class="main-textarea"
            rows="10"
            spellcheck="false"
            placeholder="| 姓名 | 年龄 | 城市 |&#10;|------|------|------|&#10;| 张三 | 25   | 北京 |&#10;| 李四 | 30   | 上海 |"
          ></textarea>
        </div>

        <div v-if="md2excelError" class="error-msg">{{ md2excelError }}</div>

        <div v-if="excelOutput" class="section">
          <div class="section-label-row">
            <label class="section-label">复制后可直接粘贴到 Excel</label>
            <button @click="copyExcel" class="copy-btn" :class="{ success: copiedExcel }">
              {{ copiedExcel ? '已复制 ✓' : '复制' }}
            </button>
          </div>
          <textarea
            :value="excelOutput"
            readonly
            class="main-textarea output-textarea"
            rows="8"
            spellcheck="false"
          ></textarea>
          <p class="hint">提示：在 Excel 中选中目标单元格后粘贴即可</p>
        </div>
      </div>

      <!-- Excel → Markdown -->
      <div v-else class="panel">
        <div class="section">
          <label class="section-label">从 Excel 复制后粘贴到此处</label>
          <textarea
            v-model="excelInput"
            class="main-textarea"
            rows="10"
            spellcheck="false"
            placeholder="在 Excel 中选中表格区域，Ctrl+C 复制，然后粘贴到这里"
          ></textarea>
        </div>

        <div v-if="excel2mdError" class="error-msg">{{ excel2mdError }}</div>

        <div v-if="mdOutput" class="section">
          <div class="section-label-row">
            <label class="section-label">Markdown 表格</label>
            <button @click="copyMd" class="copy-btn" :class="{ success: copiedMd }">
              {{ copiedMd ? '已复制 ✓' : '复制' }}
            </button>
          </div>
          <textarea
            :value="mdOutput"
            readonly
            class="main-textarea output-textarea"
            rows="8"
            spellcheck="false"
          ></textarea>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

useSeoMeta({
  title: 'Markdown 表格 ↔ Excel',
  description: 'Markdown 表格与 Excel 数据互相转换，支持一键复制粘贴',
})

const tab = ref<'md2excel' | 'excel2md'>('md2excel');

// ── Markdown → Excel ──────────────────────────────────────────
const mdInput = ref('');
const copiedExcel = ref(false);
const md2excelError = ref('');

const excelOutput = computed(() => {
  md2excelError.value = '';
  const raw = mdInput.value.trim();
  if (!raw) return '';

  const rows = raw
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 0)
    // skip separator rows like |---|---|
    .filter(l => !/^\|[\s|:-]+\|$/.test(l));

  if (rows.length === 0) return '';

  const parsed = rows.map(row => {
    // strip leading/trailing pipes then split
    const stripped = row.replace(/^\|/, '').replace(/\|$/, '');
    return stripped.split('|').map(cell => cell.trim());
  });

  // validate consistent column count
  const colCount = parsed[0].length;
  const invalid = parsed.some(r => r.length !== colCount);
  if (invalid) {
    md2excelError.value = '表格列数不一致，请检查 Markdown 格式';
    return '';
  }

  return parsed.map(row => row.join('\t')).join('\n');
});

const copyExcel = async () => {
  if (!excelOutput.value) return;
  await navigator.clipboard.writeText(excelOutput.value);
  copiedExcel.value = true;
  setTimeout(() => { copiedExcel.value = false; }, 2000);
};

// ── Excel → Markdown ──────────────────────────────────────────
const excelInput = ref('');
const copiedMd = ref(false);
const excel2mdError = ref('');

const mdOutput = computed(() => {
  excel2mdError.value = '';
  const raw = excelInput.value.trim();
  if (!raw) return '';

  const rows = raw
    .split('\n')
    .map(l => l.trimEnd())
    .filter(l => l.length > 0)
    .map(l => l.split('\t').map(cell => cell.trim()));

  if (rows.length === 0) return '';

  // normalize all rows to the same column count
  const colCount = Math.max(...rows.map(r => r.length));
  const normalized = rows.map(r => {
    while (r.length < colCount) r.push('');
    return r;
  });

  // compute column widths (min 3 for the separator dashes)
  const widths = Array.from({ length: colCount }, (_, ci) =>
    Math.max(3, ...normalized.map(r => r[ci].length))
  );

  const formatRow = (cells: string[]) =>
    '| ' + cells.map((c, i) => c.padEnd(widths[i])).join(' | ') + ' |';

  const separator =
    '| ' + widths.map(w => '-'.repeat(w)).join(' | ') + ' |';

  const [header, ...data] = normalized;
  const lines = [formatRow(header), separator, ...data.map(formatRow)];
  return lines.join('\n');
});

const copyMd = async () => {
  if (!mdOutput.value) return;
  await navigator.clipboard.writeText(mdOutput.value);
  copiedMd.value = true;
  setTimeout(() => { copiedMd.value = false; }, 2000);
};
</script>

<style scoped>
.tool-wrapper {
  background-color: #f1f5f9;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem 1.5rem;
  font-family: 'Inter', 'Noto Sans SC', sans-serif;
}

.tool-card {
  width: 100%;
  max-width: 760px;
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

/* Tabs */
.tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  background-color: #f1f5f9;
  border-radius: 10px;
  padding: 0.3rem;
}

.tab-btn {
  flex: 1;
  padding: 0.6rem 1rem;
  border: none;
  background: transparent;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  color: #64748b;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s, box-shadow 0.2s;
}

.tab-btn.active {
  background-color: #ffffff;
  color: #1e293b;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12);
}

.tab-btn:not(.active):hover {
  color: #334155;
}

/* Panel content */
.panel {
  display: flex;
  flex-direction: column;
  gap: 0;
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

.main-textarea {
  width: 100%;
  padding: 0.8rem 1rem;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 0.875rem;
  font-family: 'SF Mono', 'Fira Code', 'Consolas', monospace;
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
  white-space: nowrap;
}

.copy-btn:hover {
  background-color: #2563eb;
}

.copy-btn.success {
  background-color: #16a34a;
}

.error-msg {
  margin-bottom: 1rem;
  padding: 0.6rem 1rem;
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  color: #dc2626;
  font-size: 0.9rem;
}

.hint {
  margin-top: 0.5rem;
  font-size: 0.85rem;
  color: #94a3b8;
}
</style>
