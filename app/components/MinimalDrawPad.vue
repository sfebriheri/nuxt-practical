<script setup lang="ts">
import SignaturePad from 'signature_pad'

const props = defineProps<{
  saving?: boolean
}>()

const emit = defineEmits<{
  drawing: [dataURL: string]
}>()

const canvas = ref<HTMLCanvasElement>()
const signaturePad = ref<SignaturePad>()

onMounted(() => {
  if (!canvas.value) return
  
  signaturePad.value = new SignaturePad(canvas.value, {
    penColor: '#000000',
    backgroundColor: '#ffffff',
    minWidth: 2,
    maxWidth: 4,
  })
  
  // Resize canvas to fit container
  resizeCanvas()
  window.addEventListener('resize', resizeCanvas)
  
  // Emit drawing data when user draws
  signaturePad.value.addEventListener('endStroke', () => {
    if (!signaturePad.value || signaturePad.value.isEmpty()) return
    const dataURL = signaturePad.value.toDataURL('image/jpeg', 0.8)
    emit('drawing', dataURL)
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeCanvas)
  signaturePad.value?.off()
})

function resizeCanvas() {
  if (!canvas.value || !signaturePad.value) return
  
  const container = canvas.value.parentElement
  if (!container) return
  
  const ratio = Math.max(window.devicePixelRatio || 1, 1)
  const width = container.offsetWidth
  const height = 400 // Fixed height
  
  canvas.value.width = width * ratio
  canvas.value.height = height * ratio
  canvas.value.style.width = width + 'px'
  canvas.value.style.height = height + 'px'
  
  const ctx = canvas.value.getContext('2d')
  if (ctx) {
    ctx.scale(ratio, ratio)
  }
  
  signaturePad.value.clear()
}

function clear() {
  signaturePad.value?.clear()
}

function getCanvas() {
  return canvas.value
}

defineExpose({ clear, getCanvas })
</script>

<template>
  <div class="relative">
    <canvas
      ref="canvas"
      class="border border-gray-200 rounded-lg cursor-crosshair touch-none"
      :class="{ 'opacity-50': saving }"
    />
    <div 
      v-if="saving"
      class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-lg"
    >
      <div class="text-gray-600">Saving...</div>
    </div>
  </div>
</template>