<script setup lang="ts">
interface MCPResponse {
  success: boolean
  message?: string
  data?: unknown
  error?: string
}

const { data: tools, pending: toolsLoading, error: toolsError } = await useFetch('/api/mcp/tools')
const { executeTool } = useNuxtApp().$mcp as { executeTool: (toolName: string, params: Record<string, unknown>) => Promise<MCPResponse> }

const testResult = ref('')
const testing = ref(false)

async function testMCPTools() {
  testing.value = true
  testResult.value = ''

  try {
    // Test creating a drawing
    const createResult = await executeTool('create_drawing', {
      title: 'Test Drawing',
      description: 'A test drawing created via MCP',
      canvas_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    })

    testResult.value += `✅ Create Drawing: ${JSON.stringify(createResult, null, 2)}\n\n`

    // Test listing drawings
    const listResult = await executeTool('list_drawings', {})
    testResult.value += `✅ List Drawings: ${JSON.stringify(listResult, null, 2)}\n\n`

    // Test AI generation
    const aiResult = await executeTool('generate_ai_drawing', {
      prompt: 'A simple test drawing',
      style: 'sketch',
    })
    testResult.value += `✅ AI Generation: ${JSON.stringify(aiResult, null, 2)}\n\n`
  }
  catch (error) {
    testResult.value += `❌ Error: ${error}\n`
  }

  testing.value = false
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">
      MCP Integration Test
    </h1>

    <!-- Tools Information -->
    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">
        Available MCP Tools
      </h2>
      <div
        v-if="toolsLoading"
        class="text-gray-500"
      >
        Loading tools...
      </div>
      <div
        v-else-if="toolsError"
        class="text-red-500"
      >
        Error loading tools: {{ toolsError }}
      </div>
      <div
        v-else-if="tools"
        class="bg-gray-100 p-4 rounded-lg"
      >
        <pre class="text-sm">{{ JSON.stringify(tools, null, 2) }}</pre>
      </div>
    </div>

    <!-- Test Section -->
    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">
        Test MCP Functionality
      </h2>
      <UButton
        :loading="testing"
        :disabled="testing"
        color="primary"
        size="lg"
        @click="testMCPTools"
      >
        {{ testing ? 'Testing...' : 'Run MCP Tests' }}
      </UButton>
    </div>

    <!-- Test Results -->
    <div
      v-if="testResult"
      class="mb-8"
    >
      <h2 class="text-2xl font-semibold mb-4">
        Test Results
      </h2>
      <div class="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
        <pre>{{ testResult }}</pre>
      </div>
    </div>

    <!-- MCP Panel Demo -->
    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">
        MCP Panel Demo
      </h2>
      <div class="max-w-md">
        <MCPPanel />
      </div>
    </div>
  </div>
</template>
