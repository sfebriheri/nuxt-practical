vue
<script setup lang="ts">
interface Drawing {
  pathname: string
  customMetadata?: {
    description?: string
    uploadedAt?: string
  }
}

const { data: drawings } = await useFetch<{ blobs: Drawing[] }>('/api/drawings')
</script>

<template>
  <div>
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">
        Simple Drawing Gallery
      </h1>
      <p class="text-gray-600">
        Create and share your drawings
      </p>
    </div>

    <div v-if="drawings?.blobs?.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="drawing in drawings.blobs" 
        :key="drawing.pathname"
        class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
      >
        <img 
          :src="drawing.pathname" 
          :alt="drawing.customMetadata?.description || 'Drawing'"
          class="w-full h-48 object-cover"
        />
        <div v-if="drawing.customMetadata?.description" class="p-4">
          <p class="text-sm text-gray-700">
            {{ drawing.customMetadata.description }}
          </p>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-12">
      <div class="text-gray-400 text-6xl mb-4">🎨</div>
      <h2 class="text-xl font-semibold text-gray-700 mb-2">
        No drawings yet
      </h2>
      <p class="text-gray-500 mb-6">
        Start creating your first drawing!
      </p>
      <NuxtLink 
        to="/draw"
        class="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
      >
        Create Drawing
      </NuxtLink>
    </div>
  </div>
</template>
