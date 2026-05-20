<template>
  <div class="tool-page">
    <div class="tool-page-inner">

      <nav class="tool-back">
        <NuxtLink to="/" class="back-link">← 返回主页</NuxtLink>
      </nav>

      <div class="tool-card">
        <header class="tool-header">
          <h1>汇率计算器</h1>
          <p>实时汇率换算，数据来源：欧洲央行</p>
        </header>

        <!-- Loading -->
        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <span>正在获取汇率数据…</span>
        </div>

        <!-- Error -->
        <div v-else-if="fetchErr" class="msg msg--error">
          获取汇率数据失败，请检查网络连接后刷新页面
        </div>

        <template v-else>
          <!-- From row -->
          <div class="exchange-block">
            <label class="block-label">从</label>
            <div class="exchange-row">
              <select v-model="fromCode" class="currency-select" @change="calcTo">
                <option v-for="c in currencies" :key="c.code" :value="c.code">
                  {{ c.flag }} {{ c.code }} — {{ c.name }}
                </option>
              </select>
              <input
                v-model.number="fromAmt"
                type="number"
                class="amount-input"
                placeholder="0"
                min="0"
                @input="calcTo"
              >
            </div>
          </div>

          <!-- Swap -->
          <div class="swap-row">
            <button class="swap-btn" @click="swap" title="互换货币">⇅</button>
            <span class="rate-badge" v-if="crossRate">
              1 {{ fromCode }} = <b>{{ crossRate }}</b> {{ toCode }}
            </span>
          </div>

          <!-- To row -->
          <div class="exchange-block">
            <label class="block-label">到</label>
            <div class="exchange-row">
              <select v-model="toCode" class="currency-select" @change="calcTo">
                <option v-for="c in currencies" :key="c.code" :value="c.code">
                  {{ c.flag }} {{ c.code }} — {{ c.name }}
                </option>
              </select>
              <input
                v-model.number="toAmt"
                type="number"
                class="amount-input"
                placeholder="0"
                min="0"
                @input="calcFrom"
              >
            </div>
          </div>

          <!-- Quick target currency -->
          <div class="quick-row">
            <span class="quick-label">快速切换目标</span>
            <div class="quick-chips">
              <button
                v-for="code in quickTargets"
                :key="code"
                class="chip"
                :class="{ 'chip--active': toCode === code }"
                @click="toCode = code; calcTo()"
              >{{ code }}</button>
            </div>
          </div>

          <!-- Reference table -->
          <div class="ref-table-wrap">
            <p class="ref-title">1 {{ fromCode }} 等于</p>
            <div class="ref-table">
              <div
                v-for="c in refCurrencies"
                :key="c.code"
                class="ref-row"
                @click="toCode = c.code; calcTo()"
                :class="{ 'ref-row--active': toCode === c.code }"
              >
                <span class="ref-flag">{{ c.flag }}</span>
                <span class="ref-code">{{ c.code }}</span>
                <span class="ref-name">{{ c.name }}</span>
                <span class="ref-val">{{ getRefRate(c.code) }}</span>
              </div>
            </div>
          </div>

          <p class="data-note" v-if="rateDate">
            汇率更新于 {{ rateDate }} · 仅供参考，实际以银行/交易平台为准
          </p>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'

useSeoMeta({
  title: '汇率计算器',
  description: '实时汇率换算，支持人民币、美元、欧元、日元等主要货币，数据来源欧洲央行',
})

const currencies = [
  { code: 'CNY', name: '人民币',         flag: '🇨🇳' },
  { code: 'USD', name: '美元',           flag: '🇺🇸' },
  { code: 'EUR', name: '欧元',           flag: '🇪🇺' },
  { code: 'GBP', name: '英镑',           flag: '🇬🇧' },
  { code: 'JPY', name: '日元',           flag: '🇯🇵' },
  { code: 'HKD', name: '港元',           flag: '🇭🇰' },
  { code: 'KRW', name: '韩元',           flag: '🇰🇷' },
  { code: 'SGD', name: '新加坡元',       flag: '🇸🇬' },
  { code: 'AUD', name: '澳大利亚元',     flag: '🇦🇺' },
  { code: 'CAD', name: '加拿大元',       flag: '🇨🇦' },
  { code: 'CHF', name: '瑞士法郎',       flag: '🇨🇭' },
  { code: 'THB', name: '泰铢',           flag: '🇹🇭' },
  { code: 'MYR', name: '马来西亚林吉特', flag: '🇲🇾' },
  { code: 'INR', name: '印度卢比',       flag: '🇮🇳' },
  { code: 'MXN', name: '墨西哥比索',     flag: '🇲🇽' },
  { code: 'BRL', name: '巴西雷亚尔',     flag: '🇧🇷' },
  { code: 'NZD', name: '新西兰元',       flag: '🇳🇿' },
  { code: 'SEK', name: '瑞典克朗',       flag: '🇸🇪' },
  { code: 'NOK', name: '挪威克朗',       flag: '🇳🇴' },
  { code: 'ZAR', name: '南非兰特',       flag: '🇿🇦' },
]

// Currencies shown in the reference table
const refCurrencies = [
  { code: 'USD', name: '美元',       flag: '🇺🇸' },
  { code: 'CNY', name: '人民币',     flag: '🇨🇳' },
  { code: 'EUR', name: '欧元',       flag: '🇪🇺' },
  { code: 'GBP', name: '英镑',       flag: '🇬🇧' },
  { code: 'JPY', name: '日元',       flag: '🇯🇵' },
  { code: 'HKD', name: '港元',       flag: '🇭🇰' },
  { code: 'KRW', name: '韩元',       flag: '🇰🇷' },
  { code: 'SGD', name: '新加坡元',   flag: '🇸🇬' },
  { code: 'AUD', name: '澳大利亚元', flag: '🇦🇺' },
  { code: 'CHF', name: '瑞士法郎',   flag: '🇨🇭' },
].filter(c => c.code !== 'CNY' || true) // keep all, we'll filter by fromCode in template

const quickTargets = ['USD', 'EUR', 'GBP', 'JPY', 'HKD', 'KRW', 'SGD']

// State
const loading  = ref(true)
const fetchErr = ref(false)
const rateDate = ref('')
// Rates are stored relative to EUR (ECB base). EUR itself = 1.
const rates = ref<Record<string, number>>({})

const fromCode = ref('CNY')
const toCode   = ref('USD')
const fromAmt  = ref<number | null>(100)
const toAmt    = ref<number | null>(null)

// Get EUR-based rate for a currency code
const getEurRate = (code: string) => code === 'EUR' ? 1 : (rates.value[code] ?? 1)

// Cross rate: 1 fromCode = X toCode
const crossRate = computed(() => {
  const r = getEurRate(toCode.value) / getEurRate(fromCode.value)
  if (r === 0) return '—'
  if (r >= 1000) return r.toFixed(1)
  if (r >= 10)   return r.toFixed(3)
  if (r >= 1)    return r.toFixed(4)
  return r.toFixed(5)
})

const calcTo = () => {
  if (fromAmt.value == null) { toAmt.value = null; return }
  const r = getEurRate(toCode.value) / getEurRate(fromCode.value)
  const result = fromAmt.value * r
  toAmt.value = parseFloat(result.toFixed(result >= 100 ? 2 : result >= 1 ? 4 : 6))
}

const calcFrom = () => {
  if (toAmt.value == null) { fromAmt.value = null; return }
  const r = getEurRate(fromCode.value) / getEurRate(toCode.value)
  const result = toAmt.value * r
  fromAmt.value = parseFloat(result.toFixed(result >= 100 ? 2 : result >= 1 ? 4 : 6))
}

const swap = () => {
  ;[fromCode.value, toCode.value] = [toCode.value, fromCode.value]
  calcTo()
}

// Reference table rate: 1 fromCode = X c
const getRefRate = (code: string) => {
  if (code === fromCode.value) return '—'
  const r = getEurRate(code) / getEurRate(fromCode.value)
  if (r >= 10000) return r.toFixed(0)
  if (r >= 100)   return r.toFixed(2)
  if (r >= 1)     return r.toFixed(4)
  return r.toFixed(5)
}

watch([fromCode, toCode], calcTo)

onMounted(async () => {
  try {
    const data = await fetch('https://api.frankfurter.app/latest').then(r => r.json())
    rates.value  = data.rates  // EUR-based rates from ECB
    rateDate.value = data.date
    loading.value = false
    calcTo()
  } catch {
    fetchErr.value = true
    loading.value  = false
  }
})
</script>

<style scoped>
.tool-page { padding: 1.5rem var(--page-pad) 3rem; }
.tool-page-inner { max-width: 600px; margin: 0 auto; }

/* Back */
.tool-back { margin-bottom: 1.25rem; }
.back-link {
  display: inline-flex; align-items: center; gap: .35rem;
  font-size: .875rem; font-weight: 500; color: var(--c-text-2);
  padding: .3rem .7rem; border-radius: var(--r-md);
  border: 1px solid var(--c-border); background: var(--c-surface);
  transition: color .15s, background .15s, border-color .15s;
}
.back-link:hover { color: var(--c-accent); border-color: var(--c-accent-muted); background: var(--c-accent-bg); }

/* Card */
.tool-card {
  background: var(--c-surface); border: 1px solid var(--c-border);
  border-radius: var(--r-xl); padding: 2rem;
  box-shadow: var(--shadow-sm); display: flex; flex-direction: column; gap: 1.25rem;
}
.tool-header { text-align: center; }
.tool-header h1 { font-size: 1.5rem; font-weight: 700; color: var(--c-text-1); letter-spacing: -.02em; margin-bottom: .35rem; }
.tool-header p  { font-size: .875rem; color: var(--c-text-2); }

/* Loading */
.loading-state { display: flex; align-items: center; gap: .75rem; justify-content: center; padding: 2rem; color: var(--c-text-2); }
.spinner {
  width: 20px; height: 20px;
  border: 2px solid var(--c-border); border-top-color: var(--c-accent);
  border-radius: 50%; animation: spin .7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Error */
.msg--error {
  padding: .7rem 1rem; border-radius: var(--r-md);
  background: var(--c-danger-bg); border: 1px solid #fca5a5; color: var(--c-danger);
  font-size: .875rem;
}

/* Exchange block */
.exchange-block { display: flex; flex-direction: column; gap: .45rem; }
.block-label { font-size: .78rem; font-weight: 600; color: var(--c-text-3); text-transform: uppercase; letter-spacing: .06em; }

.exchange-row {
  display: flex; gap: .6rem;
}
.currency-select {
  flex: 1; min-width: 0;
  padding: .7rem .8rem;
  border: 1px solid var(--c-border); border-radius: var(--r-md);
  font-size: .875rem; font-family: inherit; color: var(--c-text-1);
  background: var(--c-surface); outline: none;
  transition: border-color .18s, box-shadow .18s;
  cursor: pointer;
}
.currency-select:focus { border-color: var(--c-accent); box-shadow: 0 0 0 3px var(--c-accent-bg); }

.amount-input {
  width: 140px; flex-shrink: 0;
  padding: .7rem .8rem;
  border: 1px solid var(--c-border); border-radius: var(--r-md);
  font-size: 1.1rem; font-weight: 600; font-family: 'SF Mono', monospace;
  color: var(--c-text-1); background: var(--c-surface); outline: none; text-align: right;
  transition: border-color .18s, box-shadow .18s;
}
.amount-input:focus { border-color: var(--c-accent); box-shadow: 0 0 0 3px var(--c-accent-bg); }

/* Swap */
.swap-row { display: flex; align-items: center; gap: .75rem; }
.swap-btn {
  width: 38px; height: 38px; border-radius: 50%;
  border: 1px solid var(--c-border); background: var(--c-surface);
  font-size: 1.1rem; color: var(--c-text-2);
  display: flex; align-items: center; justify-content: center;
  transition: background .15s, border-color .15s, color .15s;
  flex-shrink: 0;
}
.swap-btn:hover { background: var(--c-accent); color: #fff; border-color: var(--c-accent); }
.rate-badge {
  font-size: .85rem; color: var(--c-text-2);
  background: var(--c-surface-2); border: 1px solid var(--c-border);
  padding: .2rem .7rem; border-radius: 99px;
}
.rate-badge b { color: var(--c-accent); }

/* Quick chips */
.quick-row { display: flex; align-items: center; gap: .6rem; flex-wrap: wrap; }
.quick-label { font-size: .78rem; color: var(--c-text-3); white-space: nowrap; }
.quick-chips { display: flex; gap: .4rem; flex-wrap: wrap; }
.chip {
  padding: .2rem .6rem; border-radius: 99px; font-size: .78rem; font-weight: 600;
  border: 1px solid var(--c-border); background: var(--c-surface-2); color: var(--c-text-2);
  transition: background .15s, color .15s, border-color .15s;
}
.chip:hover, .chip--active { background: var(--c-accent-bg); color: var(--c-accent); border-color: var(--c-accent-muted); }

/* Reference table */
.ref-table-wrap { background: var(--c-surface-2); border: 1px solid var(--c-border); border-radius: var(--r-lg); overflow: hidden; }
.ref-title { padding: .6rem 1rem .4rem; font-size: .78rem; font-weight: 600; color: var(--c-text-3); text-transform: uppercase; letter-spacing: .06em; }
.ref-table { display: flex; flex-direction: column; }
.ref-row {
  display: grid; grid-template-columns: 1.5rem 3rem 1fr auto;
  align-items: center; gap: .5rem;
  padding: .55rem 1rem;
  border-top: 1px solid var(--c-border);
  cursor: pointer; transition: background .12s;
}
.ref-row:hover    { background: var(--c-accent-bg); }
.ref-row--active  { background: var(--c-accent-bg); }
.ref-flag { font-size: 1rem; }
.ref-code { font-size: .875rem; font-weight: 700; color: var(--c-text-1); }
.ref-name { font-size: .8rem; color: var(--c-text-3); }
.ref-val  { font-size: .9rem; font-weight: 600; color: var(--c-text-1); font-family: 'SF Mono', monospace; text-align: right; }

.data-note { font-size: .78rem; color: var(--c-text-3); text-align: center; }

/* Mobile */
@media (max-width: 520px) {
  .tool-page { padding: 1rem var(--page-pad) 2rem; }
  .tool-card { padding: 1.25rem 1rem; border-radius: var(--r-lg); }
  .exchange-row { flex-direction: column; }
  .amount-input { width: 100%; text-align: left; }
}
</style>
