<template>
  <div class="mcp-panel bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
        MCP Tools
      </h3>
      <UBadge color="success">
        {{ tools?.length || 0 }} tools available
      </UBadge>
    </div>

    <!-- Loading State -->
    <div
      v-if="isLoading"
      class="flex items-center justify-center py-8"
    >
      <UIcon
        name="i-ph-spinner"
        class="animate-spin text-2xl text-blue-500"
      />
      <span class="ml-2 text-gray-600 dark:text-gray-400">Loading MCP tools...</span>
    </div>

    <!-- Error State -->
    <UAlert
      v-if="error"
      color="error"
      variant="soft"
      title="MCP Error"
      :description="String(error)"
      class="mb-4"
    />

    <!-- Tools List -->
    <div
      v-if="!isLoading && tools && tools.length > 0"
      class="space-y-4"
    >
      <!-- Drawing Tools -->
      <div v-if="drawingTools.length > 0">
        <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Drawing Tools
        </h4>
        <div class="grid gap-2">
          <UCard
            v-for="tool in drawingTools"
            :key="tool.name"
            class="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
            @click="showToolDialog(tool)"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium text-sm">
                  {{ tool.name }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {{ tool.description }}
                </p>
              </div>
              <UIcon
                name="i-ph-arrow-right"
                class="text-gray-400"
              />
            </div>
          </UCard>
        </div>
      </div>

      <!-- Storage Tools -->
      <div v-if="storageTools.length > 0">
        <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Storage Tools
        </h4>
        <div class="grid gap-2">
          <UCard
            v-for="tool in storageTools"
            :key="tool.name"
            class="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
            @click="showToolDialog(tool)"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium text-sm">
                  {{ tool.name }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {{ tool.description }}
                </p>
              </div>
              <UIcon
                name="i-ph-arrow-right"
                class="text-gray-400"
              />
            </div>
          </UCard>
        </div>
      </div>

      <!-- AI Tools -->
      <div v-if="aiTools.length > 0">
        <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          AI Tools
        </h4>
        <div class="grid gap-2">
          <UCard
            v-for="tool in aiTools"
            :key="tool.name"
            class="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
            @click="showToolDialog(tool)"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium text-sm">
                  {{ tool.name }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {{ tool.description }}
                </p>
              </div>
              <UIcon
                name="i-ph-arrow-right"
                class="text-gray-400"
              />
            </div>
          </UCard>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Quick Actions
        </h4>
        <div class="grid grid-cols-1 gap-2">
          <UButton
            variant="outline"
            size="sm"
            icon="i-ph-plus"
            @click="quickCreateDrawing"
          >
            New Drawing
          </UButton>
          <UButton
            variant="outline"
            size="sm"
            icon="i-ph-list"
            @click="quickListDrawings"
          >
            List Drawings
          </UButton>
          <UButton
            variant="outline"
            size="sm"
            icon="i-ph-robot"
            @click="quickGenerateAI"
          >
            AI Generate
          </UButton>
        </div>
      </div>

      <!-- Last Result -->
      <div
        v-if="lastResult"
        class="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
      >
        <h5 class="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
          Last Result:
        </h5>
        <pre class="text-xs text-gray-800 dark:text-gray-200 overflow-auto">{{ JSON.stringify(lastResult, null, 2) }}</pre>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-if="!isLoading && (!tools || tools.length === 0)"
      class="text-center py-8"
    >
      <UIcon
        name="i-ph-package"
        class="text-4xl text-gray-400 mb-2"
      />
      <p class="text-gray-500 dark:text-gray-400">
        No MCP tools available
      </p>
    </div>
  </div>

  <!-- Tool Execution Dialog -->
  <UModal v-model="showDialog">
    <UCard>
      <template #header>
        <h3 class="text-lg font-semibold">
          Execute {{ selectedTool?.name }}
        </h3>
      </template>

      <div
        v-if="selectedTool"
        class="space-y-4"
      >
        <p class="text-sm text-gray-600 dark:text-gray-400">
          {{ selectedTool.description }}
        </p>

        <!-- Tool Parameters -->
        <div
          v-if="selectedTool.parameters && Object.keys(selectedTool.parameters).length > 0"
          class="space-y-3"
        >
          <h4 class="text-sm font-medium">
            Parameters:
          </h4>
          <div
            v-for="(param, paramName) in selectedTool.parameters"
            :key="paramName"
            class="space-y-1"
          >
            <label class="text-xs font-medium text-gray-700 dark:text-gray-300">
              {{ paramName }}
              <span
                v-if="param.required"
                class="text-red-500"
              >*</span>
            </label>
            <UInput
              v-model="toolParams[paramName] as string"
              :placeholder="param.description || `Enter ${paramName}`"
              size="sm"
            />
            <p
              v-if="param.description"
              class="text-xs text-gray-500"
            >
              {{ param.description }}
            </p>
          </div>
        </div>

        <!-- No Parameters -->
        <div
          v-else
          class="text-sm text-gray-500"
        >
          This tool requires no parameters.
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end space-x-2">
          <UButton
            variant="ghost"
            @click="showDialog = false"
          >
            Cancel
          </UButton>
          <UButton
            color="primary"
            @click="executeSelectedTool"
          >
            Execute
          </UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
import { useMCP } from '../../composables/useMCP'

interface MCPResponse {
  success: boolean
  message?: string
  data?: unknown
  error?: string
}

const { tools, isLoading, error, executeTool, createDrawing, listDrawings, generateAIDrawing } = useMCP()

// Reactive state
const showDialog = ref(false)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const selectedTool = ref<any>(null)
const toolParams = ref<Record<string, unknown>>({})
const lastResult = ref<MCPResponse | null>(null)

// Computed properties for categorized tools
const drawingTools = computed(() => tools.value?.filter(tool => tool.category === 'drawing') || [])
const storageTools = computed(() => tools.value?.filter(tool => tool.category === 'storage') || [])
const aiTools = computed(() => tools.value?.filter(tool => tool.category === 'ai') || [])

// Methods
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const showToolDialog = (tool: any) => {
  selectedTool.value = tool
  toolParams.value = {}

  // Set default values
  if (tool.parameters) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Object.entries(tool.parameters).forEach(([paramName, param]: [string, any]) => {
      if (param.default !== undefined) {
        toolParams.value[paramName] = param.default
      }
    })
  }

  showDialog.value = true
}

const executeSelectedTool = async () => {
  if (!selectedTool.value) return

  try {
    const result = await executeTool(selectedTool.value.name, toolParams.value)
    lastResult.value = result
    showDialog.value = false

    // Show success notification
    if (result.success) {
      console.log('Tool executed successfully:', result)
    }
  }
  catch (err) {
    console.error('Error executing tool:', err)
  }
}

// Quick action methods
const quickCreateDrawing = async () => {
  try {
    const result = await createDrawing(`Drawing ${Date.now()}`, {
      width: 800,
      height: 600,
      backgroundColor: '#ffffff',
    })
    lastResult.value = result
  }
  catch (err) {
    console.error('Error creating drawing:', err)
  }
}

const quickListDrawings = async () => {
  try {
    const result = await listDrawings({ limit: 5 })
    lastResult.value = result
  }
  catch (err) {
    console.error('Error listing drawings:', err)
  }
}

const quickGenerateAI = async () => {
  try {
    const result = await generateAIDrawing('A beautiful landscape with mountains and trees', {
      style: 'sketch',
      size: 'medium',
    })
    lastResult.value = result
  }
  catch (err) {
    console.error('Error generating AI drawing:', err)
  }
}
</script>
