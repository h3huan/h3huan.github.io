<template>
  <div class="tool-page">
    <div class="plot-inner">

      <nav class="tool-back">
        <NuxtLink to="/" class="back-link">← 返回主页</NuxtLink>
      </nav>

      <div class="plot-layout">

        <!-- ── Canvas ──────────────────────────────────── -->
        <div class="canvas-wrap" ref="canvasWrap">
          <canvas
            ref="canvas"
            class="plot-canvas"
            @wheel.prevent="onWheel"
            @mousedown="onMouseDown"
            @mousemove="onMouseMove"
            @mouseup="onMouseUp"
            @mouseleave="onMouseLeave"
            @touchstart.prevent="onTouchStart"
            @touchmove.prevent="onTouchMove"
            @touchend="onTouchEnd"
          ></canvas>
          <div v-if="hoverXY" class="coords-pill">
            x&nbsp;=&nbsp;{{ hoverXY.x }}&nbsp;&nbsp;y&nbsp;=&nbsp;{{ hoverXY.y }}
          </div>
        </div>

        <!-- ── Control panel ───────────────────────────── -->
        <div class="ctrl-panel">

          <!-- Functions -->
          <div class="ctrl-block">
            <p class="ctrl-title">函数</p>
            <div class="fn-list">
              <div v-for="(fn, i) in fns" :key="i" class="fn-row">
                <span class="fn-dot" :style="{ background: fn.color }"></span>
                <span class="fn-eq">f&thinsp;(x) =</span>
                <input
                  v-model="fn.expr"
                  class="fn-input"
                  type="text"
                  :placeholder="placeholders[i]"
                  spellcheck="false"
                  autocomplete="off"
                  @input="scheduleDraw"
                >
                <button v-if="fns.length > 1" @click="removeFn(i)" class="fn-del" title="删除">✕</button>
              </div>
            </div>
            <button class="add-fn-btn" :disabled="fns.length >= 4" @click="addFn">
              ＋ 添加函数
            </button>
          </div>

          <!-- Examples -->
          <div class="ctrl-block">
            <p class="ctrl-title">示例</p>
            <div class="ex-grid">
              <button v-for="ex in examples" :key="ex.expr" class="ex-btn" @click="loadExample(ex.expr)">
                {{ ex.label }}
              </button>
            </div>
          </div>

          <!-- View controls -->
          <div class="ctrl-block">
            <p class="ctrl-title">视图</p>
            <div class="view-row">
              <div class="zoom-group">
                <button class="zoom-btn" @click="zoomOut">−</button>
                <span class="zoom-pct">{{ scalePct }}%</span>
                <button class="zoom-btn" @click="zoomIn">+</button>
              </div>
              <button class="reset-btn" @click="resetView">重置</button>
            </div>
          </div>

          <!-- Syntax help -->
          <div class="ctrl-block help-block">
            <p class="ctrl-title">支持的符号</p>
            <div class="help-tags">
              <code v-for="sym in symbols" :key="sym" class="sym">{{ sym }}</code>
            </div>
            <p class="help-note">使用 <code>^</code> 表示乘方，如 x^2；用 * 表示乘法</p>
          </div>

        </div>
      </div>

      <!-- 工具说明 -->
      <article class="tool-desc">
        <h2>关于函数绘图器</h2>
        <p>在线数学函数可视化工具，在笛卡尔坐标系中实时绘制函数图像。支持最多同时绘制 4 条曲线，坐标系可自由缩放和平移，适合验证数学计算结果、辅助教学演示或探索函数行为规律。</p>
        <h3>支持的函数与符号</h3>
        <p>三角函数：<code>sin(x)</code>、<code>cos(x)</code>、<code>tan(x)</code>；反三角：<code>asin</code>、<code>acos</code>、<code>atan</code>；指数与对数：<code>exp(x)</code>（即 eˣ）、<code>log(x)</code>（自然对数）；其他：<code>sqrt(x)</code>（平方根）、<code>abs(x)</code>（绝对值）、<code>ceil</code>、<code>floor</code>；常数：<code>pi</code>（π）、<code>e</code>；乘方用 <code>^</code>，如 <code>x^2</code> 表示 x²，乘法用 <code>*</code>。</p>
        <h3>操作说明</h3>
        <ol>
          <li>在函数输入框中输入表达式，如 <code>sin(x)</code> 或 <code>x^2 - 2*x + 1</code>，图像实时更新</li>
          <li>鼠标滚轮缩放坐标系；按住鼠标拖拽平移视图；点击「重置」还原初始视角</li>
          <li>点击「添加函数」可叠加多条曲线（最多 4 条）对比，每条曲线颜色不同</li>
          <li>移动鼠标到画布上可实时读取当前坐标值；触屏设备支持双指捏合缩放</li>
        </ol>
      </article>

      <!-- 相关工具 -->
      <nav class="related-tools">
        <p class="related-title">相关工具</p>
        <div class="related-links">
          <NuxtLink to="/caculate" class="related-link">🧾 简易算帐</NuxtLink>
          <NuxtLink to="/currency" class="related-link">💱 汇率计算器</NuxtLink>
          <NuxtLink to="/comma-separator" class="related-link">✂️ 逗号分隔器</NuxtLink>
        </div>
      </nav>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

useSeoMeta({
  title: '函数绘图器',
  ogTitle: '函数绘图器 – Toool',
  description: '在笛卡尔坐标系中绘制数学函数图像，支持 sin cos tan sqrt 等，可缩放平移',
  ogDescription: '在笛卡尔坐标系中绘制数学函数图像，支持 sin cos tan sqrt 等，可缩放平移',
})

const BASE_SCALE = 60
const COLORS = ['#4361ee', '#e03131', '#2f9e44', '#f08c00']

const examples = [
  { label: 'sin(x)',   expr: 'sin(x)'    },
  { label: 'cos(x)',   expr: 'cos(x)'    },
  { label: 'tan(x)',   expr: 'tan(x)'    },
  { label: 'x²',      expr: 'x^2'       },
  { label: 'x³',      expr: 'x^3'       },
  { label: '√x',      expr: 'sqrt(x)'   },
  { label: '1/x',     expr: '1/x'       },
  { label: '|x|',     expr: 'abs(x)'    },
  { label: 'eˣ',      expr: 'exp(x)'    },
  { label: 'ln(x)',   expr: 'log(x)'    },
]

const symbols = ['sin','cos','tan','sqrt','abs','log','exp','pi','e','^','*','/']
const placeholders = ['sin(x)', 'x^2', 'cos(x)', 'sqrt(abs(x))']

// ── Refs ─────────────────────────────────────────────────────
const canvas    = ref<HTMLCanvasElement | null>(null)
const canvasWrap = ref<HTMLElement | null>(null)

const fns    = ref([{ expr: 'sin(x)', color: COLORS[0] }])
const viewX  = ref(0)
const viewY  = ref(0)
const scale  = ref(BASE_SCALE)
const hoverXY = ref<{ x: string; y: string } | null>(null)

const scalePct = computed(() => Math.round(scale.value / BASE_SCALE * 100))

// ── Math evaluator ───────────────────────────────────────────
const MATH_PREAMBLE = `const {
  sin,cos,tan,asin,acos,atan,atan2,sinh,cosh,tanh,
  sqrt,cbrt,abs,log,log2,log10,exp,pow,
  ceil,floor,round,sign,min,max,hypot,
  PI:pi, E:e
} = Math;`

const buildFn = (expr: string) => {
  const src = expr.trim().replace(/\^/g, '**')
  if (!src) return null
  try {
    return new Function('x', `${MATH_PREAMBLE} return (${src});`) as (x: number) => number
  } catch { return null }
}

// ── Grid helpers ─────────────────────────────────────────────
const niceNum = (n: number): number => {
  if (n <= 0) return 1
  const e = Math.floor(Math.log10(n))
  const m = n / 10 ** e
  const nice = m < 1.5 ? 1 : m < 3.5 ? 2 : m < 7.5 ? 5 : 10
  return nice * 10 ** e
}

const fmtLabel = (n: number): string => {
  if (n === 0) return '0'
  const a = Math.abs(n)
  if (a >= 1e5 || (a < 1e-3 && a > 0)) return n.toExponential(0)
  return (+(+n.toPrecision(4))).toString()
}

// ── Draw ─────────────────────────────────────────────────────
const draw = () => {
  const c = canvas.value
  if (!c) return
  const ctx = c.getContext('2d')!
  const dpr = window.devicePixelRatio || 1
  const W = c.width  / dpr   // logical px
  const H = c.height / dpr
  const s = scale.value
  const ox = W / 2  // canvas origin (center)
  const oy = H / 2

  // World ↔ canvas
  const toX = (x: number) => (x - viewX.value) * s + ox
  const toY = (y: number) => -(y - viewY.value) * s + oy

  ctx.save()
  ctx.scale(dpr, dpr)

  // Background
  ctx.fillStyle = '#f9fafb'
  ctx.fillRect(0, 0, W, H)

  // Grid
  const gridW = niceNum(80 / s)
  const xMin = -ox / s + viewX.value
  const xMax = (W - ox) / s + viewX.value
  const yMin = -(H - oy) / s + viewY.value
  const yMax = oy / s + viewY.value

  ctx.strokeStyle = '#e2e8f0'
  ctx.lineWidth = 1

  const x0 = Math.ceil(xMin / gridW) * gridW
  for (let gx = x0; gx <= xMax; gx += gridW) {
    const cx = toX(gx)
    ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, H); ctx.stroke()
  }
  const y0 = Math.ceil(yMin / gridW) * gridW
  for (let gy = y0; gy <= yMax; gy += gridW) {
    const cy = toY(gy)
    ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(W, cy); ctx.stroke()
  }

  // Axes
  const axY = toY(0)
  const axX = toX(0)
  ctx.strokeStyle = '#334155'
  ctx.lineWidth = 1.5

  if (axY >= 0 && axY <= H) {
    ctx.beginPath(); ctx.moveTo(0, axY); ctx.lineTo(W, axY); ctx.stroke()
    // Arrow
    ctx.beginPath(); ctx.moveTo(W - 10, axY - 5); ctx.lineTo(W, axY); ctx.lineTo(W - 10, axY + 5); ctx.stroke()
  }
  if (axX >= 0 && axX <= W) {
    ctx.beginPath(); ctx.moveTo(axX, 0); ctx.lineTo(axX, H); ctx.stroke()
    // Arrow
    ctx.beginPath(); ctx.moveTo(axX - 5, 10); ctx.lineTo(axX, 0); ctx.lineTo(axX + 5, 10); ctx.stroke()
  }

  // Axis labels
  const fontSize = 11
  ctx.font = `${fontSize}px 'SF Mono','Fira Code',monospace`
  ctx.fillStyle = '#64748b'

  const labelY = Math.min(Math.max(axY, 2), H - fontSize - 4)
  ctx.textAlign = 'center'; ctx.textBaseline = 'top'
  for (let gx = x0; gx <= xMax; gx += gridW) {
    if (Math.abs(gx) < gridW * 0.01) continue
    ctx.fillText(fmtLabel(gx), toX(gx), labelY + 4)
  }

  const labelX = Math.min(Math.max(axX, 2), W - 44)
  ctx.textAlign = 'left'; ctx.textBaseline = 'middle'
  for (let gy = y0; gy <= yMax; gy += gridW) {
    if (Math.abs(gy) < gridW * 0.01) continue
    ctx.fillText(fmtLabel(gy), labelX + 4, toY(gy))
  }

  // Origin "O"
  ctx.fillStyle = '#94a3b8'
  ctx.textAlign = 'left'; ctx.textBaseline = 'top'
  ctx.fillText('O', labelX + 4, labelY + 4)

  // Axis name labels
  ctx.fillStyle = '#475569'
  ctx.font = `italic ${fontSize + 1}px serif`
  ctx.textAlign = 'left'; ctx.textBaseline = 'bottom'
  if (axY >= 0 && axY <= H) ctx.fillText('x', W - 8, axY - 2)
  ctx.textAlign = 'right'; ctx.textBaseline = 'top'
  if (axX >= 0 && axX <= W) ctx.fillText('y', axX - 4, 2)

  // Plot curves
  for (const fn of fns.value) {
    const fnEval = buildFn(fn.expr)
    if (!fnEval) continue

    ctx.strokeStyle = fn.color
    ctx.lineWidth = 2.5
    ctx.lineJoin = 'round'
    ctx.beginPath()

    let penDown = false
    let prevCy = 0

    for (let px = 0; px <= W; px++) {
      const x = (px - ox) / s + viewX.value
      let y: number
      try { y = fnEval(x) } catch { y = NaN }

      if (!isFinite(y) || isNaN(y)) {
        if (penDown) { ctx.stroke(); ctx.beginPath() }
        penDown = false; continue
      }

      const cy = toY(y)

      // Detect asymptote jump
      if (penDown && Math.abs(cy - prevCy) > H * 5) {
        ctx.stroke(); ctx.beginPath(); penDown = false
      }

      penDown ? ctx.lineTo(px, cy) : ctx.moveTo(px, cy)
      penDown = true
      prevCy = cy
    }
    ctx.stroke()
  }

  ctx.restore()
}

let drawTimer: ReturnType<typeof setTimeout> | null = null
const scheduleDraw = () => {
  if (drawTimer) clearTimeout(drawTimer)
  drawTimer = setTimeout(draw, 60)
}

// ── Resize ───────────────────────────────────────────────────
const resizeCanvas = () => {
  const wrap = canvasWrap.value
  const c    = canvas.value
  if (!wrap || !c) return
  const dpr = window.devicePixelRatio || 1
  c.width  = wrap.clientWidth  * dpr
  c.height = wrap.clientHeight * dpr
  draw()
}

// ── View controls ─────────────────────────────────────────────
const zoomIn   = () => { scale.value = Math.min(scale.value * 1.4, BASE_SCALE * 200); draw() }
const zoomOut  = () => { scale.value = Math.max(scale.value / 1.4, BASE_SCALE / 100); draw() }
const resetView = () => { scale.value = BASE_SCALE; viewX.value = 0; viewY.value = 0; draw() }

// ── Function management ───────────────────────────────────────
const addFn = () => {
  if (fns.value.length < 4) fns.value.push({ expr: '', color: COLORS[fns.value.length] })
}
const removeFn = (i: number) => { fns.value.splice(i, 1); draw() }
const loadExample = (expr: string) => { fns.value[0].expr = expr; draw() }

// ── Mouse ─────────────────────────────────────────────────────
let dragging = false, lastMX = 0, lastMY = 0

const onWheel = (e: WheelEvent) => {
  const factor = e.deltaY > 0 ? 1 / 1.12 : 1.12
  scale.value = Math.min(Math.max(scale.value * factor, BASE_SCALE / 100), BASE_SCALE * 200)
  draw()
}

const onMouseDown = (e: MouseEvent) => {
  dragging = true; lastMX = e.clientX; lastMY = e.clientY
  if (canvas.value) canvas.value.style.cursor = 'grabbing'
}

const onMouseMove = (e: MouseEvent) => {
  const c = canvas.value
  if (!c) return
  const dpr = window.devicePixelRatio || 1
  const rect = c.getBoundingClientRect()
  const px = e.clientX - rect.left
  const py = e.clientY - rect.top
  const W = c.width / dpr
  const H = c.height / dpr
  const wx = (px - W / 2) / scale.value + viewX.value
  const wy = -((py - H / 2)) / scale.value + viewY.value
  hoverXY.value = { x: wx.toFixed(3), y: wy.toFixed(3) }

  if (!dragging) return
  viewX.value -= (e.clientX - lastMX) / scale.value
  viewY.value += (e.clientY - lastMY) / scale.value
  lastMX = e.clientX; lastMY = e.clientY
  draw()
}

const onMouseUp    = () => { dragging = false; if (canvas.value) canvas.value.style.cursor = 'crosshair' }
const onMouseLeave = () => { dragging = false; hoverXY.value = null; if (canvas.value) canvas.value.style.cursor = 'crosshair' }

// ── Touch ─────────────────────────────────────────────────────
let lastTouchDist = 0, lastTX = 0, lastTY = 0

const onTouchStart = (e: TouchEvent) => {
  if (e.touches.length === 1) { lastTX = e.touches[0].clientX; lastTY = e.touches[0].clientY }
  else if (e.touches.length === 2) {
    lastTouchDist = Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY
    )
  }
}

const onTouchMove = (e: TouchEvent) => {
  if (e.touches.length === 1) {
    viewX.value -= (e.touches[0].clientX - lastTX) / scale.value
    viewY.value += (e.touches[0].clientY - lastTY) / scale.value
    lastTX = e.touches[0].clientX; lastTY = e.touches[0].clientY
    draw()
  } else if (e.touches.length === 2) {
    const d = Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY
    )
    scale.value = Math.min(Math.max(scale.value * (d / lastTouchDist), BASE_SCALE / 100), BASE_SCALE * 200)
    lastTouchDist = d
    draw()
  }
}

const onTouchEnd = () => {}

let ro: ResizeObserver | null = null
onMounted(() => {
  resizeCanvas()
  ro = new ResizeObserver(resizeCanvas)
  if (canvasWrap.value) ro.observe(canvasWrap.value)
})
onBeforeUnmount(() => ro?.disconnect())
</script>

<style scoped>
/* ── Page shell ───────────────────────────────────────── */
.tool-page { padding: 1.5rem var(--page-pad) 2rem; }
.plot-inner { max-width: 1160px; margin: 0 auto; }

.tool-back { margin-bottom: 1.25rem; }
.back-link {
  display: inline-flex; align-items: center; gap: .35rem;
  font-size: .875rem; font-weight: 500; color: var(--c-text-2);
  padding: .3rem .7rem; border-radius: var(--r-md);
  border: 1px solid var(--c-border); background: var(--c-surface);
  transition: color .15s, background .15s, border-color .15s;
}
.back-link:hover { color: var(--c-accent); border-color: var(--c-accent-muted); background: var(--c-accent-bg); }

/* ── Layout ───────────────────────────────────────────── */
.plot-layout {
  display: grid;
  grid-template-columns: 1fr 268px;
  gap: 1rem;
  align-items: start;
}

/* ── Canvas ───────────────────────────────────────────── */
.canvas-wrap {
  position: relative;
  background: #f9fafb;
  border: 1px solid var(--c-border);
  border-radius: var(--r-lg);
  overflow: hidden;
  height: 520px;
  box-shadow: var(--shadow-sm);
}

.plot-canvas {
  display: block;
  width: 100%;
  height: 100%;
  cursor: crosshair;
  touch-action: none;
}

.coords-pill {
  position: absolute;
  bottom: .75rem;
  left: .75rem;
  padding: .2rem .65rem;
  background: rgba(255,255,255,.85);
  backdrop-filter: blur(6px);
  border: 1px solid var(--c-border);
  border-radius: 99px;
  font-size: .75rem;
  font-family: 'SF Mono', monospace;
  color: var(--c-text-2);
  pointer-events: none;
}

/* ── Control panel ────────────────────────────────────── */
.ctrl-panel {
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: var(--r-lg);
  padding: 1rem;
  box-shadow: var(--shadow-xs);
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

.ctrl-block { display: flex; flex-direction: column; gap: .55rem; }

.ctrl-title {
  font-size: .72rem; font-weight: 700; color: var(--c-text-3);
  text-transform: uppercase; letter-spacing: .07em;
}

/* Functions */
.fn-list { display: flex; flex-direction: column; gap: .45rem; }
.fn-row  { display: flex; align-items: center; gap: .4rem; }

.fn-dot {
  width: 10px; height: 10px; border-radius: 50%;
  flex-shrink: 0;
}

.fn-eq { font-size: .78rem; color: var(--c-text-3); white-space: nowrap; flex-shrink: 0; }

.fn-input {
  flex: 1; min-width: 0;
  padding: .4rem .55rem;
  border: 1px solid var(--c-border); border-radius: var(--r-sm);
  font-size: .8125rem; font-family: 'SF Mono', 'Fira Code', monospace;
  color: var(--c-text-1); background: var(--c-surface); outline: none;
  transition: border-color .18s, box-shadow .18s;
}
.fn-input:focus { border-color: var(--c-accent); box-shadow: 0 0 0 2px var(--c-accent-bg); }

.fn-del {
  width: 22px; height: 22px; border-radius: 50%;
  border: 1px solid var(--c-border); background: transparent;
  font-size: .65rem; color: var(--c-text-3);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; transition: background .13s, color .13s;
}
.fn-del:hover { background: var(--c-danger-bg); color: var(--c-danger); border-color: var(--c-danger); }

.add-fn-btn {
  padding: .35rem .7rem; font-size: .8rem; font-weight: 600;
  color: var(--c-accent); background: var(--c-accent-bg);
  border: 1px solid var(--c-accent-muted); border-radius: var(--r-md);
  transition: background .15s;
}
.add-fn-btn:hover:not(:disabled) { background: var(--c-accent); color: #fff; }
.add-fn-btn:disabled { opacity: .4; cursor: not-allowed; }

/* Examples */
.ex-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: .35rem;
}
.ex-btn {
  padding: .3rem .5rem; font-size: .78rem; font-family: 'SF Mono', monospace;
  border: 1px solid var(--c-border); border-radius: var(--r-sm);
  background: var(--c-surface-2); color: var(--c-text-2);
  transition: background .13s, color .13s, border-color .13s;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.ex-btn:hover { background: var(--c-accent-bg); color: var(--c-accent); border-color: var(--c-accent-muted); }

/* View controls */
.view-row { display: flex; align-items: center; gap: .5rem; }
.zoom-group { display: flex; align-items: center; border: 1px solid var(--c-border); border-radius: var(--r-md); overflow: hidden; }
.zoom-btn {
  width: 30px; height: 30px; font-size: 1.1rem; font-weight: 500;
  border: none; background: var(--c-surface-2); color: var(--c-text-2);
  transition: background .13s, color .13s;
}
.zoom-btn:hover { background: var(--c-accent-bg); color: var(--c-accent); }
.zoom-pct {
  padding: 0 .5rem; font-size: .78rem; font-weight: 600;
  color: var(--c-text-2); border-left: 1px solid var(--c-border); border-right: 1px solid var(--c-border);
  height: 30px; display: flex; align-items: center; min-width: 46px; justify-content: center;
}
.reset-btn {
  padding: .3rem .65rem; font-size: .78rem; font-weight: 600;
  color: var(--c-text-2); background: var(--c-surface-2);
  border: 1px solid var(--c-border); border-radius: var(--r-md);
  transition: background .13s, color .13s;
}
.reset-btn:hover { background: var(--c-surface); color: var(--c-text-1); }

/* Help */
.help-block { background: var(--c-surface-2); border: 1px solid var(--c-border); border-radius: var(--r-md); padding: .65rem .75rem; }
.help-tags { display: flex; flex-wrap: wrap; gap: .3rem; margin-bottom: .45rem; }
.sym {
  font-size: .72rem; font-family: 'SF Mono', monospace;
  background: var(--c-surface); border: 1px solid var(--c-border);
  padding: .1rem .35rem; border-radius: 4px; color: var(--c-text-2);
}
.help-note { font-size: .72rem; color: var(--c-text-3); line-height: 1.5; }
.help-note code { font-family: 'SF Mono', monospace; background: var(--c-surface); padding: 0 .25rem; border-radius: 3px; }

/* ── Responsive ───────────────────────────────────────── */
@media (max-width: 860px) {
  .plot-layout { grid-template-columns: 1fr; }
  .canvas-wrap { height: 55vw; min-height: 300px; max-height: 480px; }
  .ctrl-panel  { padding: .85rem; }
  .ex-grid     { grid-template-columns: repeat(5, 1fr); }
}

@media (max-width: 520px) {
  .tool-page { padding: .75rem var(--page-pad) 1.5rem; }
  .canvas-wrap { height: 68vw; min-height: 260px; }
  .ex-grid { grid-template-columns: repeat(4, 1fr); }
}
</style>
