<template>
  <!-- Linked card -->
  <NuxtLink v-if="url" :to="url" class="tool-card">
    <div class="card-icon">{{ icon }}</div>
    <div class="card-body">
      <div class="card-title">{{ title }}</div>
      <div v-if="description" class="card-desc">{{ description }}</div>
    </div>
    <span class="card-arrow" aria-hidden="true">→</span>
  </NuxtLink>

  <!-- Placeholder (no url) -->
  <div v-else class="tool-card tool-card--placeholder">
    <div class="card-icon">{{ icon }}</div>
    <div class="card-body">
      <div class="card-title">{{ title }}</div>
      <div v-if="description" class="card-desc">{{ description }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  icon: string
  title: string
  url?: string
  description?: string
}>()
</script>

<style scoped>
.tool-card {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  padding: 1.1rem 1.1rem 1rem;
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: var(--r-lg);
  color: inherit;
  text-decoration: none;
  position: relative;
  transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
  box-shadow: var(--shadow-xs);
  min-height: 110px;
  overflow: hidden;
}

/* Active / linked card hover */
.tool-card:not(.tool-card--placeholder):hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
  border-color: var(--c-accent-muted);
}

/* Placeholder */
.tool-card--placeholder {
  cursor: default;
  background: var(--c-surface-2);
  border-style: dashed;
  opacity: 0.6;
}

.card-icon {
  font-size: 1.75rem;
  line-height: 1;
}

.card-body { flex: 1; }

.card-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--c-text-1);
  line-height: 1.35;
}

.card-desc {
  margin-top: 0.25rem;
  font-size: 0.78rem;
  color: var(--c-text-3);
  line-height: 1.4;
}

.card-arrow {
  position: absolute;
  top: 0.9rem;
  right: 0.9rem;
  font-size: 0.875rem;
  color: var(--c-text-3);
  transition: color 0.15s, transform 0.15s;
}

.tool-card:not(.tool-card--placeholder):hover .card-arrow {
  color: var(--c-accent);
  transform: translateX(3px);
}
</style>
