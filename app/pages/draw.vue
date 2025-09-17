vue
<script setup lang="ts">
const description = ref('')
const isSaving = ref(false)

async function save() {
  if (!drawPadRef.value) return
  
  isSaving.value = true
  try {
    const canvas = drawPadRef.value.getCanvas()
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob(resolve!, 'image/png')
    })
    
    const formData = new FormData()
    formData.append('image', blob, 'drawing.png')
    formData.append('description', description.value)
    
    await fetch('/api/drawings', {
      method: 'POST',
      body: formData
    })
    
    await navigateTo('/')
  } catch (error) {
    console.error('Failed to save drawing:', error)
  } finally {
    isSaving.value = false
  }
}

const drawPadRef = ref()
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-4">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-2xl font-bold mb-6">Create Drawing</h1>
      
      <div class="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <MinimalDrawPad 
          ref="drawPadRef"
          @drawing="() => {}"
          class="w-full h-96 border border-gray-200 rounded"
        />
      </div>
      
      <div class="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Description (optional)
        </label>
        <input
          v-model="description"
          type="text"
          placeholder="Describe your drawing..."
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div class="flex gap-4">
        <button
          @click="drawPadRef?.clear()"
          class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
        >
          Clear
        </button>
        <button
          @click="save"
          :disabled="isSaving"
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {{ isSaving ? 'Saving...' : 'Save & Share' }}
        </button>
      </div>
    </div>
  </div>
</template>
