html
<script setup lang="ts">
useSeoMeta({
  title: 'Minimal Draw',
  description: 'Simple drawing app',
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white border-b border-gray-200 px-4 py-3">
      <div class="max-w-4xl mx-auto flex items-center justify-between">
        <NuxtLink to="/" class="text-xl font-bold text-gray-900">
          ✏️ Draw
        </NuxtLink>
        <NuxtLink 
          to="/draw" 
          class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          New Drawing
        </NuxtLink>
      </div>
    </header>
    
    <main class="max-w-4xl mx-auto px-4 py-8">
      <NuxtPage />
    </main>
  </div>
</template>

<style>
/* Minimal custom styles */
* {
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
  color: #374151;
}

button:disabled {
  cursor: not-allowed;
}

.transition-colors {
  transition: background-color 0.2s ease, color 0.2s ease;
}
</style>
